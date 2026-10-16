// Run with `npm test` (builds first, then runs against dist/).
const { test, before, after } = require("node:test");
const assert = require("node:assert/strict");
const http = require("node:http");
const { ApiClient } = require("../dist");

let server;
let baseUrl;
const requests = [];

before(async () => {
    server = http.createServer((req, res) => {
        let raw = "";
        req.on("data", (chunk) => (raw += chunk));
        req.on("end", () => {
            requests.push({ url: req.url, raw });
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end("42"); // batch ID
        });
    });
    await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
    baseUrl = `http://127.0.0.1:${server.address().port}`;
});

after(() => new Promise((resolve) => server.close(resolve)));

function client() {
    return new ApiClient({ token: "test", baseUrl });
}

const item = {
    contentID: 7,
    properties: { referenceName: "posts", definitionName: "Post" },
    fields: { title: "A post" },
    seo: null,
    scripts: null,
};

async function saveOne(contentItem) {
    requests.length = 0;
    const ids = await client().contentMethods.saveContentItem(contentItem, "00000000-u", "en-us", true);
    assert.deepEqual(ids, [42]);
    assert.equal(requests.length, 1);
    return JSON.parse(requests[0].raw);
}

test("saveContentItem posts geo: null so the API clears the whole block", async () => {
    assert.equal((await saveOne({ ...item, geo: null })).geo, null);
});

test("saveContentItem leaves geo out when it is undefined, so the API keeps it", async () => {
    assert.equal("geo" in (await saveOne({ ...item, geo: undefined })), false);
});

test("saveContentItem posts geo properties as given, keeping null and leaving omitted ones out", async () => {
    const body = await saveOne({ ...item, geo: { summary: null, ai: { crawl: "block" } } });
    assert.deepEqual(body.geo, { summary: null, ai: { crawl: "block" } });
});

test("saveContentItems posts each item's geo in the multi batch", async () => {
    requests.length = 0;
    await client().contentMethods.saveContentItems(
        [{ ...item, geo: { schemaType: "ItemPage" } }, { ...item, contentID: 8 }],
        "00000000-u", "en-us", true);
    const body = JSON.parse(requests[0].raw);
    assert.match(requests[0].url, /\/item\/multi/);
    assert.deepEqual(body[0].geo, { schemaType: "ItemPage" });
    assert.equal("geo" in body[1], false);
});
