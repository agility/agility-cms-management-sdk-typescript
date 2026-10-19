// Run with `npm test` (builds first, then runs against dist/).
const { test, before, after } = require("node:test");
const assert = require("node:assert/strict");
const http = require("node:http");
const { ApiClient } = require("../dist");

let server;
let baseUrl;
const bodies = [];

before(async () => {
    server = http.createServer((req, res) => {
        let raw = "";
        req.on("data", (chunk) => (raw += chunk));
        req.on("end", () => {
            bodies.push(raw);
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

const page = { pageID: 12, name: "about", title: "About", seo: { metaDescription: "d" } };

async function save(pageItem) {
    bodies.length = 0;
    const ids = await client().pageMethods.savePage(pageItem, "00000000-u", "en-us", -1, -1, true);
    assert.deepEqual(ids, [42]);
    assert.equal(bodies.length, 1);
    return bodies[0];
}

test("savePage posts geo: null so the API clears the whole block", async () => {
    const raw = await save({ ...page, geo: null });
    assert.match(raw, /"geo":null/);
    assert.equal(JSON.parse(raw).geo, null);
});

test("savePage leaves geo out when it is undefined, so the API keeps it", async () => {
    const raw = await save({ ...page, geo: undefined });
    assert.equal("geo" in JSON.parse(raw), false);
});

test("savePage posts a property set to null inside geo", async () => {
    const raw = await save({ ...page, geo: { summary: null, schemaType: "AboutPage" } });
    assert.deepEqual(JSON.parse(raw).geo, { summary: null, schemaType: "AboutPage" });
});
