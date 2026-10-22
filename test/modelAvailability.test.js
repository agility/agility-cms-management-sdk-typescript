// Run with `npm test` (builds first, then runs against dist/).
const { test, before, after } = require("node:test");
const assert = require("node:assert/strict");
const http = require("node:http");
const { ApiClient } = require("../dist");

const guid = "00000000-u";
let server;
let baseUrl;
const requests = [];
// The next response the server sends: { status, body }.
let reply;

before(async () => {
    server = http.createServer((req, res) => {
        let raw = "";
        req.on("data", (chunk) => (raw += chunk));
        req.on("end", () => {
            requests.push({ method: req.method, url: req.url, raw });
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

function respond(body, status = 200) {
    requests.length = 0;
    reply = { status, body };
}

const hero = {
    modelID: 12,
    modelReferenceName: "HeroBanner",
    addableBy: {
        permissions: ["Administrator", "Designer"],
        users: [{ userID: 5, emailAddress: "a@example.com" }],
        teams: [{ teamID: 9, name: "Web team" }],
    },
    allowedIn: {
        sitemaps: [{ sitemapID: 1, referenceName: "website", name: "Website" }],
        pageModels: [{ pageModelID: 3, name: "Landing Page" }],
        zones: [
            { zoneID: 14, pageModelID: 3, pageModelName: "Landing Page", referenceName: "MainContentZone", name: "Main Content Zone" },
        ],
    },
};

test("getModelAvailability reads one model's rules", async () => {
    respond(hero);
    const availability = await client().modelMethods.getModelAvailability(12, guid);
    assert.deepEqual(availability, hero);
    assert.equal(requests[0].method, "GET");
    assert.equal(requests[0].url, `/api/v1/instance/${guid}/model/12/availability`);
});

test("getModelAvailability returns null groups for a model with no rules", async () => {
    respond({ modelID: 7, modelReferenceName: "Text", addableBy: null, allowedIn: null });
    const availability = await client().modelMethods.getModelAvailability(7, guid);
    assert.equal(availability.addableBy, null);
    assert.equal(availability.allowedIn, null);
});

test("getAllModelAvailability reads the instance's list", async () => {
    respond([hero]);
    const list = await client().modelMethods.getAllModelAvailability(guid);
    assert.deepEqual(list, [hero]);
    assert.equal(requests[0].method, "GET");
    assert.equal(requests[0].url, `/api/v1/instance/${guid}/model/availability`);
});

test("saveModelAvailability posts the rules and returns them as saved", async () => {
    respond(hero);
    const saved = await client().modelMethods.saveModelAvailability(12, hero, guid);
    assert.deepEqual(saved, hero);
    assert.equal(requests[0].method, "POST");
    assert.equal(requests[0].url, `/api/v1/instance/${guid}/model/12/availability`);
    assert.deepEqual(JSON.parse(requests[0].raw), hero);
});

test("saveModelAvailability posts addableBy: null so the API keeps the stored who rules", async () => {
    respond(hero);
    await client().modelMethods.saveModelAvailability(12, { addableBy: null, allowedIn: hero.allowedIn }, guid);
    const body = JSON.parse(requests[0].raw);
    assert.equal(body.addableBy, null);
    assert.deepEqual(body.allowedIn, hero.allowedIn);
});

test("saveModelAvailability leaves a group out when it is undefined", async () => {
    respond(hero);
    await client().modelMethods.saveModelAvailability(12, { allowedIn: hero.allowedIn }, guid);
    const body = JSON.parse(requests[0].raw);
    assert.equal("addableBy" in body, false);
});

test("saveModelAvailability posts name-only targets and empty groups as given", async () => {
    respond(hero);
    const availability = {
        allowedIn: {
            sitemaps: [{ referenceName: "website" }],
            pageModels: [],
            zones: [{ pageModelName: "Landing Page", referenceName: "MainContentZone" }],
        },
        addableBy: { permissions: [], users: [], teams: [] },
    };
    await client().modelMethods.saveModelAvailability(12, availability, guid);
    assert.deepEqual(JSON.parse(requests[0].raw), availability);
});

test("a 409 from an instance without the feature reaches the caller with its status", async () => {
    respond("Component availability isn't available on this instance yet.", 409);
    await assert.rejects(client().modelMethods.getAllModelAvailability(guid), (err) => {
        assert.equal(err.statusCode, 409);
        assert.match(err.message, /isn't available on this instance yet/);
        return true;
    });
});

test("a 400 listing unresolved targets reaches the caller with its message", async () => {
    respond('Unknown zone "Blog Post" / "Sidebar".', 400);
    await assert.rejects(client().modelMethods.saveModelAvailability(12, hero, guid), (err) => {
        assert.equal(err.statusCode, 400);
        assert.match(err.message, /Unable to save availability for model id: 12\. \(HTTP 400\): Unknown zone/);
        return true;
    });
});

test("saveModel posts isVisible when it is set", async () => {
    respond({ id: 12, isVisible: false });
    const saved = await client().modelMethods.saveModel({ id: 12, referenceName: "HeroBanner", fields: [], isVisible: false }, guid);
    assert.equal(JSON.parse(requests[0].raw).isVisible, false);
    assert.equal(saved.isVisible, false);
});

test("saveModel leaves isVisible out when it is undefined, so the API keeps the stored value", async () => {
    respond({ id: 12 });
    await client().modelMethods.saveModel({ id: 12, referenceName: "HeroBanner", fields: [] }, guid);
    assert.equal("isVisible" in JSON.parse(requests[0].raw), false);
});

test("getSitemap carries each sitemap's referenceName, and tolerates an API that omits it", async () => {
    respond([
        { digitalChannelID: 1, name: "Website", referenceName: "website", digitalChannelTypeName: "Website", isDefaultChannel: true, pages: [] },
        { digitalChannelID: 2, name: "Old", digitalChannelTypeName: "Website", isDefaultChannel: false, pages: [] },
    ]);
    const sitemaps = await client().pageMethods.getSitemap(guid, "en-us");
    assert.equal(sitemaps[0].referenceName, "website");
    assert.equal(sitemaps[1].referenceName, undefined);
});
