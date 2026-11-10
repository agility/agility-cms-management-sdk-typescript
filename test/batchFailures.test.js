// Run with `npm test` (builds first, then runs against dist/).
const { test, before, after } = require("node:test");
const assert = require("node:assert/strict");
const http = require("node:http");
const { ApiClient, BatchFailedException } = require("../dist");

let server;
let baseUrl;
const requests = [];
// The batch the stub answers `GET batch/{id}` with. Every other request gets batch ID 42.
let batch;

before(async () => {
    server = http.createServer((req, res) => {
        let raw = "";
        req.on("data", (chunk) => (raw += chunk));
        req.on("end", () => {
            requests.push({ method: req.method, url: req.url });
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify(/\/batch\/42\?/.test(req.url) ? batch : 42));
        });
    });
    await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
    baseUrl = `http://127.0.0.1:${server.address().port}`;
});

after(() => new Promise((resolve) => server.close(resolve)));

function client() {
    return new ApiClient({ token: "test", baseUrl, retryCount: 5, duration: 1 });
}

const fkError = "The UPDATE statement conflicted with the FOREIGN KEY constraint \"FK_DigitalChannel_PageItemContainer\".";

// The shape the batch processor writes when an item fails.
const failedPageBatch = {
    batchID: 42,
    batchState: 3,
    errorData: JSON.stringify({
        totalItems: 1, successCount: 0, failureCount: 1,
        message: "Completed with errors. 0 of 1 item(s) succeeded. 1 item(s) failed.",
        failedItems: [{ batchItemId: 7, itemId: 118, itemType: "Page", errorType: "ManagementException", errorMessage: fkError }],
    }),
    items: [{ itemID: 118, itemTypeName: "Page", errorMessage: JSON.stringify({ message: fkError }) }],
};

const page = { pageID: 118, name: "test", title: "Test" };

test("savePage throws when the batch reports a failed item, instead of returning the page ID", async () => {
    batch = failedPageBatch;
    await assert.rejects(client().pageMethods.savePage(page, "00000000-u", "en-us"), (err) => {
        assert.match(err.message, /Unable to save page/);
        assert.match(err.message, /Page 118: The UPDATE statement conflicted/);
        const inner = err.innerError;
        assert.ok(inner instanceof BatchFailedException);
        assert.equal(inner.name, "BatchFailedException");
        assert.equal(inner.batchID, 42);
        assert.deepEqual(inner.failedItems, [{ itemID: 118, itemType: "Page", errorMessage: fkError }]);
        assert.deepEqual(inner.itemIDs, []);
        return true;
    });
});

test("savePage still returns the page IDs when the batch succeeded", async () => {
    batch = { batchID: 42, batchState: 3, errorData: null, items: [{ itemID: 118, itemTypeName: "Page", errorMessage: null }] };
    assert.deepEqual(await client().pageMethods.savePage(page, "00000000-u", "en-us"), [118]);
});

test("a summary with failureCount 0 is not a failure", async () => {
    batch = { batchID: 42, batchState: 3, errorData: JSON.stringify({ totalItems: 1, successCount: 1, failureCount: 0 }), items: [{ itemID: 5, itemTypeName: "Content" }] };
    assert.deepEqual(await client().contentMethods.saveContentItem({ contentID: 5 }, "00000000-u", "en-us"), [5]);
});

test("saveContentItems reports which items failed and which saved", async () => {
    batch = {
        batchID: 42, batchState: 3,
        errorData: JSON.stringify({ totalItems: 2, successCount: 1, failureCount: 1, failedItems: [{ itemId: -1, itemType: "Content", errorMessage: "Missing field" }] }),
        items: [{ itemID: 31, itemTypeName: "Content" }, { itemID: -1, itemTypeName: "Content", errorMessage: "Missing field" }],
    };
    await assert.rejects(client().contentMethods.saveContentItems([{}, {}], "00000000-u", "en-us"), (err) => {
        assert.deepEqual(err.innerError.failedItems, [{ itemID: -1, itemType: "Content", errorMessage: "Missing field" }]);
        assert.deepEqual(err.innerError.itemIDs, [31]);
        return true;
    });
});

test("plain-text errorData is still a failure", async () => {
    batch = { batchID: 42, batchState: 3, errorData: "Something went wrong", items: [{ itemID: 9, itemTypeName: "Page" }] };
    await assert.rejects(client().pageMethods.publishPage(9, "00000000-u", "en-us"), (err) => {
        assert.match(err.message, /Something went wrong/);
        assert.deepEqual(err.innerError.failedItems, []);
        return true;
    });
});

test("a failed item without errorData is still a failure", async () => {
    batch = { batchID: 42, batchState: 3, errorData: null, items: [{ itemID: 9, itemTypeName: "Content", errorMessage: "Item is locked" }] };
    await assert.rejects(client().contentMethods.publishContent(9, "00000000-u", "en-us"), /Content 9: Item is locked/);
});

test("batchMethods.publishBatch throws when the batch failed", async () => {
    batch = failedPageBatch;
    await assert.rejects(client().batchMethods.publishBatch(1, "00000000-u"), /Batch 42 completed with errors/);
});

test("returnBatchId skips polling, so it never throws for a failed batch", async () => {
    batch = failedPageBatch;
    requests.length = 0;
    assert.deepEqual(await client().pageMethods.savePage(page, "00000000-u", "en-us", -1, -1, true), [42]);
    assert.equal(requests.some(r => r.url.includes("/batch/")), false);
});

test("getPageHistory and getPageComments call the page routes, not the content item routes", async () => {
    requests.length = 0;
    await client().pageMethods.getPageHistory("en-us", "00000000-u", 118, 10, 20);
    await client().pageMethods.getPageComments("en-us", "00000000-u", 118, 10, 20);
    assert.deepEqual(requests.map(r => r.url), [
        "/api/v1/instance/00000000-u/en-us/page/118/history?take=10&skip=20",
        "/api/v1/instance/00000000-u/en-us/page/118/comments?take=10&skip=20",
    ]);
});
