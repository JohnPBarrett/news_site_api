const db = require("../db/connection.js");
const testData = require("../db/data/test-data/index.js");
const seed = require("../db/seeds/seed.js");
const app = require("../app");
const request = require("supertest");

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe("/api/topics", () => {
  describe("GET", () => {
    it("get request to /api/topics will return a status 200 and an array of objects with each topic", () => {
      return request(app)
        .get("/api/topics")
        .expect(200)
        .then(({ body }) => {
          expect(Array.isArray(body.topics)).toBe(true);
          body.topics.forEach((topic) => {
            expect(topic).toEqual(
              expect.objectContaining({
                slug: expect.any(String),
                description: expect.any(String),
              })
            );
          });
        });
    });
    it("returns a 404 and a message when path is incorrect", () => {
      return request(app)
        .get("/api/topic")
        .expect(404)
        .catch((err) => console.log(err));
    });
  });
});

describe("/api/articles/:articleId", () => {
  describe("GET", () => {
    it.only("server responds with 200 response and the test article", () => {
      return request(app)
        .get("/api/articles/1")
        .expect(200)
        .then(({ body }) => {
          expect(body).toEqual({
            author: "butter_bridge",
            title: "Living in the shadow of a great man",
            article_id: 1,
            body: "I find this existence challenging",
            topic: "mitch",
            created_at: "2020-07-09T21:11:00.000Z",
            votes: 100,
            comment_count: 11,
          });
        });
    });
    it.only("returns with 400 status and sends back message when trying to access an article that does not exist", () => {
      return request(app)
        .get("/api/articles/99999")
        .expect(400)
        .then(({ body }) => {
          expect(body.message).toBe("Article does not exist");
        });
    });
    it.only("returns with 400 status and sends back message when trying to use invalid value for articleId parameter", () => {
      return request(app)
        .get("/api/articles/apple")
        .expect(400)
        .then(({ body }) => {
          expect(body.message).toBe("Invalid input");
        });
    });
  });
});
