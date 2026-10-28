// Run with `npm test` (builds first, then runs against dist/).
const { test, before, after } = require("node:test");
const assert = require("node:assert/strict");
const http = require("node:http");
const { ApiClient, SearchNotAvailableException } = require("../dist");

let server;
let baseUrl;
const requests = [];
// The status and body the stub answers the next request with.
let reply = { status: 200, body: {} };

before(async () => {
    server = http.createServer((req, res) => {
        let raw = "";
        req.on("data", (chunk) => (raw += chunk));
        req.on("end", () => {
            requests.push({ method: req.method, url: req.url, headers: req.headers, raw });
            res.writeHead(reply.status, { "Content-Type": "application/json" });
            res.end(JSON.stringify(reply.body));
        });
    });
    await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
    baseUrl = `http://127.0.0.1:${server.address().port}`;
});

after(() => new Promise((resolve) => server.close(resolve)));

function client() {
    return new ApiClient({ token: "test", baseUrl });
}

const result = {
    query: "newsletter",
    relaxed: false,
    facets: { content: { count: 2, capped: false }, page: { count: 1, capped: false } },
    total: 2,
    hits: [
        { kind: "content", typeLabel: "List Item", name: "Spring newsletter", snippet: "<mark>Newsletter</mark>", matchedFields: ["_title"], score: 90, contentID: 34, viewLink: "content/list-12/listitem-34" },
        { kind: "content", typeLabel: "List Item", name: "Autumn newsletter", matchedFields: ["_title"], score: 80, contentID: 35 },
    ],
    indexing: { pending: 0, catchingUp: false },
};

async function search(request, status = 200, body = result) {
    requests.length = 0;
    reply = { status, body };
    return client().searchMethods.search("00000000-u", request);
}

test("search posts the request to the instance's search endpoint with the token", async () => {
    await search({ query: "newsletter" });
    assert.equal(requests.length, 1);
    assert.equal(requests[0].method, "POST");
    assert.equal(requests[0].url, "/api/v1/instance/00000000-u/search");
    assert.equal(requests[0].headers.authorization, "Bearer test");
    assert.match(requests[0].headers["content-type"], /application\/json/);
});

test("search sends only the properties that are set", async () => {
    await search({ query: "newsletter", kinds: undefined, take: 10 });
    assert.deepEqual(JSON.parse(requests[0].raw), { query: "newsletter", take: 10 });
});

test("search sends every filter as the API names it", async () => {
    await search({
        query: "\"spring sale\"",
        kinds: ["content", "page"],
        locale: "en-us",
        containers: ["posts"],
        models: ["Post"],
        state: "published",
        modifiedAfter: new Date("2026-01-02T03:04:05Z"),
        skip: 25,
        take: 50,
    });
    assert.deepEqual(JSON.parse(requests[0].raw), {
        query: "\"spring sale\"",
        kinds: ["content", "page"],
        locale: "en-us",
        containers: ["posts"],
        models: ["Post"],
        state: "published",
        modifiedAfter: "2026-01-02T03:04:05.000Z",
        skip: 25,
        take: 50,
    });
});

test("search returns the result as the API sent it", async () => {
    const res = await search({ query: "newsletter" });
    assert.deepEqual(res, result);
});

test("a 400 throws an Exception with the status and the API's message, not SearchNotAvailableException", async () => {
    const body = { statusCode: 400, exceptionMessage: "A query is required.", additionalParameters: null };
    await assert.rejects(search({ query: "" }, 400, body), (err) => {
        assert.equal(err instanceof SearchNotAvailableException, false);
        assert.equal(err.statusCode, 400);
        assert.deepEqual(err.responseData, body);
        assert.match(err.message, /HTTP 400/);
        assert.match(err.message, /A query is required\./);
        return true;
    });
    assert.equal(requests.length, 1, "a 400 is not retried");
});

test("a 501 throws SearchNotAvailableException", async () => {
    const body = { statusCode: 501, exceptionMessage: "Search is not available for this instance yet.", additionalParameters: null };
    await assert.rejects(search({ query: "newsletter" }, 501, body), (err) => {
        assert.ok(err instanceof SearchNotAvailableException);
        assert.ok(err instanceof Error);
        assert.equal(err.name, "SearchNotAvailableException");
        assert.equal(err.statusCode, 501);
        assert.deepEqual(err.responseData, body);
        assert.match(err.message, /Search is not available for this instance yet\./);
        return true;
    });
    assert.equal(requests.length, 1, "a 501 is not retried");
});

test("a 500 throws a plain Exception", async () => {
    await assert.rejects(search({ query: "newsletter" }, 500, { exceptionMessage: "boom" }), (err) => {
        assert.equal(err instanceof SearchNotAvailableException, false);
        assert.equal(err.statusCode, 500);
        return true;
    });
    assert.equal(requests.length, 1);
});
