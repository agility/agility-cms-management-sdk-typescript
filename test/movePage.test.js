// Run with `npm test` (builds first, then runs against dist/).
const { test, before, after } = require("node:test");
const assert = require("node:assert/strict");
const http = require("node:http");
const { ApiClient } = require("../dist");

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

const moved = { pageID: 8, parentPageID: 7, versionID: 580, moved: true, siblingPageIDs: [15, 13, 11, 8, 10, 9] };

async function move(args, status = 200, body = moved) {
    requests.length = 0;
    reply = { status, body };
    return new ApiClient({ token: "test", baseUrl }).pageMethods.movePage(...args);
}

test("posts to the page's move endpoint with the parent and the page to place before", async () => {
    await move([8, "00000000-u", "en-us", 7, 10]);
    assert.equal(requests.length, 1);
    assert.equal(requests[0].method, "POST");
    assert.equal(requests[0].url, "/api/v1/instance/00000000-u/en-us/page/8/move?parentPageID=7&placeBeforePageID=10");
    assert.equal(requests[0].headers.authorization, "Bearer test");
});

test("defaults to the root of the sitemap, last", async () => {
    await move([8, "00000000-u", "en-us"]);
    assert.equal(requests[0].url, "/api/v1/instance/00000000-u/en-us/page/8/move?parentPageID=-1&placeBeforePageID=-1");
});

test("returns where the page sits after the move", async () => {
    const result = await move([8, "00000000-u", "en-us", 7, 10]);
    assert.deepEqual(result, moved);
});

test("a page already in place comes back with moved false", async () => {
    const result = await move([8, "00000000-u", "en-us", 7, -1], 200, { ...moved, moved: false });
    assert.equal(result.moved, false);
});

test("a 400 throws with the status and the server's message", async () => {
    await assert.rejects(
        () => move([7, "00000000-u", "en-us", 80, -1], 400, "Parent page 80 is under page 7. A page can't be moved under one of its own descendants."),
        (err) => {
            assert.equal(err.statusCode, 400);
            assert.match(err.message, /descendants/);
            return true;
        }
    );
});

test("a 404 throws with statusCode 404", async () => {
    await assert.rejects(
        () => move([999, "00000000-u", "en-us"], 404, "Page 999 was not found."),
        (err) => err.statusCode === 404
    );
});
