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
    it("server responds with 200 response and the test article", () => {
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
    it("returns with 400 status and sends back message when trying to access an article that does not exist", () => {
      return request(app)
        .get("/api/articles/99999")
        .expect(400)
        .then(({ body }) => {
          expect(body.message).toBe("Article does not exist");
        });
    });
    it("returns with 400 status and sends back message when trying to use invalid value for articleId parameter", () => {
      return request(app)
        .get("/api/articles/apple")
        .expect(400)
        .then(({ body }) => {
          expect(body.message).toBe("Invalid input");
        });
    });
  });
  describe("PATCH", () => {
    it("Returns a 201 status and the updated article when receiving positive vote", () => {
      const voteInc = { inc_votes: 10 };
      return request(app)
        .patch("/api/articles/1")
        .send(voteInc)
        .expect(201)
        .then(({ body }) => {
          expect(body).toEqual({
            author: "butter_bridge",
            title: "Living in the shadow of a great man",
            article_id: 1,
            body: "I find this existence challenging",
            topic: "mitch",
            created_at: "2020-07-09T21:11:00.000Z",
            votes: 110,
          });
        });
    });
    it("Returns a 201 status and the updated article when receiving negative vote", () => {
      const voteInc = { inc_votes: -150 };
      return request(app)
        .patch("/api/articles/1")
        .send(voteInc)
        .expect(201)
        .then(({ body }) => {
          expect(body).toEqual({
            author: "butter_bridge",
            title: "Living in the shadow of a great man",
            article_id: 1,
            body: "I find this existence challenging",
            topic: "mitch",
            created_at: "2020-07-09T21:11:00.000Z",
            votes: -50,
          });
        });
    });
    it("returns with 400 status and sends back message when trying to update an article that does not exist", () => {
      const vote = { inc_votes: 40 };
      return request(app)
        .patch("/api/articles/99999")
        .send(vote)
        .expect(400)
        .then(({ body }) => {
          expect(body.message).toBe("Article does not exist");
        });
    });
    it("returns with 400 status and sends back message when trying to use invalid value for articleId parameter", () => {
      const vote = { inc_votes: 40 };
      return request(app)
        .patch("/api/articles/apple")
        .send(vote)
        .expect(400)
        .then(({ body }) => {
          expect(body.message).toBe("Invalid input");
        });
    });
    it("returns with 400 status and psql error when trying to update with incorrect value data type", () => {
      const vote = { inc_votes: "honey" };
      return request(app)
        .patch("/api/articles/1")
        .send(vote)
        .expect(400)
        .then(({ body }) => {
          expect(body.message).toBe("Invalid input");
        });
    });
    it("returns with 400 status and invalid field error when sending a body with the wrong field name", () => {
      const vote = { this_is_wrong: 1 };
      return request(app)
        .patch("/api/articles/1")
        .send(vote)
        .expect(400)
        .then(({ body }) => {
          expect(body.message).toBe("Invalid field body");
        });
    });
  });
});

describe("/api/articles", () => {
  describe("GET", () => {
    it("returns a 200 response and an array of article objects", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body }) => {
          expect(Array.isArray(body.articles)).toBe(true);
          body.articles.forEach((article) => {
            expect(article).toEqual(
              expect.objectContaining({
                author: expect.any(String),
                title: expect.any(String),
                article_id: expect.any(Number),
                topic: expect.any(String),
                created_at: expect.any(String),
                votes: expect.any(Number),
                comment_count: expect.any(Number),
              })
            );
          });
        });
    });
    it.only("By default function returns an array sorted by created_at", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body }) => {
          expect(body.articles).toBeSortedBy("created_at");
        });
    });
  });
});
