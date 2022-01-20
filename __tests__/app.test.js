const db = require("../db/connection.js");
const testData = require("../db/data/test-data/index.js");
const seed = require("../db/seeds/seed.js");
const app = require("../app");
const request = require("supertest");

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe("/api", () => {
  it("returns json file detailing all developed endpoints", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body }) => {
        for (let key in body) {
          expect(body[key].description).not.toBe(null);
        }
      });
  });
});

describe("/api/topics", () => {
  describe("GET", () => {
    it("get request to /api/topics will return a status 200 and an array of objects with each topic", () => {
      return request(app)
        .get("/api/topics")
        .expect(200)
        .then(({ body }) => {
          expect(Array.isArray(body.topics)).toBe(false);
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
  describe("POST", () => {
    it("returns a 201 response and the newly created topic when receiving a valid topic object", () => {
      const topic = {
        slug: "dogs",
        description: "dogs are awesome",
      };
      return request(app)
        .post("/api/topics")
        .send(topic)
        .expect(201)
        .then(({ body }) => {
          expect(body).toEqual({
            slug: "dogs",
            description: "dogs are awesome",
          });
        });
    });
    it("returns a 400 and error message when receiving an invalid field", () => {
      const badTopic = {
        snail: "dogs",
        description: "dogs are awesome",
      };
      return request(app)
        .post("/api/topics")
        .send(badTopic)
        .expect(400)
        .then(({ body }) => {
          expect(body.message).toBe("Invalid field body");
        });
    });
    it("returns a 400 and error message when receiving a null value", () => {
      const badTopic = {
        slug: null,
        description: "dogs are awesome",
      };
      return request(app)
        .post("/api/topics")
        .send(badTopic)
        .expect(400)
        .then(({ body }) => {
          expect(body.message).toBe("Fields cannot be null values");
        });
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
    it("comment_count value is 0 for articles that have no comments", () => {
      return request(app)
        .get("/api/articles/2")
        .expect(200)
        .then(({ body }) => {
          expect(body).toEqual({
            author: "icellusedkars",
            title: "Sony Vaio; or, The Laptop",
            article_id: 2,
            body: "Call me Mitchell. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would buy a laptop about a little and see the codey part of the world. It is a way I have of driving off the spleen and regulating the circulation. Whenever I find myself growing grim about the mouth; whenever it is a damp, drizzly November in my soul; whenever I find myself involuntarily pausing before coffin warehouses, and bringing up the rear of every funeral I meet; and especially whenever my hypos get such an upper hand of me, that it requires a strong moral principle to prevent me from deliberately stepping into the street, and methodically knocking people’s hats off—then, I account it high time to get to coding as soon as I can. This is my substitute for pistol and ball. With a philosophical flourish Cato throws himself upon his sword; I quietly take to the laptop. There is nothing surprising in this. If they but knew it, almost all men in their degree, some time or other, cherish very nearly the same feelings towards the the Vaio with me.",
            topic: "mitch",
            created_at: "2020-10-16T06:03:00.000Z",
            votes: 0,
            comment_count: 0,
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
  describe("DELETE", () => {
    it("returns a 204 error and deletes the article and comments for article specified articleId", () => {
      return request(app)
        .delete("/api/articles/1")
        .expect(204)
        .then((response) => {
          expect(response.body).toEqual({});
          const articleResult = db.query(
            "SELECT * FROM articles WHERE article_id = 1;"
          );

          return articleResult;
        })
        .then((articleResult) => {
          expect(articleResult.rows.length).toBe(0);
          const commentResult = db.query(
            "SELECT * FROM comments WHERE article_id = 1;"
          );
          return commentResult;
        })
        .then((commentResult) => {
          expect(commentResult.rows.length).toBe(0);
        });
    });
    it("returns a 400 error when using wrong data type for articleId parameter", () => {
      return request(app)
        .delete("/api/articles/orange")
        .expect(400)
        .then(({ body }) => {
          expect(body.message).toBe("Invalid input");
        });
    });
    it("returns a 400 error when trying to delete an article that does not exists", () => {
      return request(app)
        .delete("/api/articles/999999")
        .expect(400)
        .then(({ body }) => {
          expect(body.message).toBe("Article does not exist");
        });
    });
  });
});

describe("/api/articles", () => {
  describe("GET", () => {
    describe("Ordering and sortby", () => {
      describe("General use testing", () => {
        it("returns a 200 response and an array of article objects when no parameters given", () => {
          return request(app)
            .get("/api/articles")
            .expect(200)
            .then(({ body }) => {
              expect(Array.isArray(body.articles)).toBe(true);
              expect(body.articles.length > 0).toBe(true);
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
                    total_count: expect.any(Number),
                  })
                );
              });
            });
        });
        it("By default function returns an array sorted by created_at in descending order", () => {
          return request(app)
            .get("/api/articles")
            .expect(200)
            .then(({ body }) => {
              expect(body.articles).toBeSortedBy("created_at", {
                descending: true,
              });
            });
        });
        it("function sorts by provided sort_by query param in descending order", () => {
          return request(app)
            .get("/api/articles?sort_by=article_id")
            .expect(200)
            .then(({ body }) => {
              expect(body.articles).toBeSortedBy("article_id", {
                descending: true,
              });
            });
        });
        it("function sorts by created_at in order of provided order query param", () => {
          return request(app)
            .get("/api/articles?order=asc")
            .expect(200)
            .then(({ body }) => {
              expect(body.articles).toBeSortedBy("created_at");
            });
        });
        it("function sorts by both sortBy and in order of provided query params", () => {
          return request(app)
            .get("/api/articles?sort_by=votes&order=asc")
            .expect(200)
            .then(({ body }) => {
              expect(body.articles).toBeSortedBy("votes");
            });
        });
      });
      describe("Error testing", () => {
        it("Function returns a 400 and an error message when provided a sort_by field that does not exist", () => {
          return request(app)
            .get("/api/articles?sort_by=apple")
            .expect(400)
            .then(({ body }) => {
              expect(body.message).toBe("Invalid sort field");
            });
        });
        it("Function returns a 400 and an error message when provided an invalid order value", () => {
          return request(app)
            .get("/api/articles?order=lemon")
            .expect(400)
            .then(({ body }) => {
              expect(body.message).toBe("Invalid order field");
            });
        });
      });
    });
    describe("Pagination", () => {
      it("by default the endpoint will only return 10 results and does not have any offsets", () => {
        return request(app)
          .get("/api/articles?sort_by=article_id&order=asc")
          .expect(200)
          .then(({ body }) => {
            expect(body.articles.length).toBe(10);
            body.articles.forEach((article) => {
              expect(article.article_id < 11).toBe(true);
            });
          });
      });
      it("endpoint will return results specified by limit paramter ", () => {
        return request(app)
          .get("/api/articles?limit=7")
          .expect(200)
          .then(({ body }) => {
            expect(body.articles.length).toBe(7);
          });
      });
      it("endpoint will offset results specified by p parameter", () => {
        return request(app)
          .get("/api/articles?p=3&limit=2&sort_by=article_id&order=asc")
          .expect(200)
          .then(({ body }) => {
            expect(body.articles.length).toBe(2);
            body.articles.forEach((article) => {
              expect(article.article_id === 5 || article.article_id === 6).toBe(
                true
              );
            });
          });
      });
      it("endpoint will give default limit value if limit has an incorrect data type", () => {
        return request(app)
          .get("/api/articles?limit=butter")
          .expect(200)
          .then(({ body }) => {
            expect(body.articles.length).toBe(10);
          });
      });
      it("endpoint will give first page if offset value has an incorrect data type", () => {
        return request(app)
          .get("/api/articles?p=berry&limit=2&sort_by=article_id&order=asc")
          .expect(200)
          .then(({ body }) => {
            expect(body.articles.length).toBe(2);
            body.articles.forEach((article) => {
              expect(article.article_id === 1 || article.article_id === 2).toBe(
                true
              );
            });
          });
      });
      it("total_count parameter does not change when limit field is used as long as no other filter is present", () => {
        return request(app)
          .get("/api/articles?limit=3")
          .expect(200)
          .then(({ body }) => {
            expect(body.articles.length).toBe(3);
            body.articles.forEach((article) => {
              expect(article.total_count).toBe(12);
            });
          });
      });
    });
    describe("Filtering by topic", () => {
      it("function returns a 200 response and an array of articles object with filtered topic", () => {
        return request(app)
          .get("/api/articles?topic=mitch")
          .expect(200)
          .then(({ body }) => {
            body.articles.forEach((article) => {
              expect(article.topic).toBe("mitch");
            });
          });
      });
      it("function returns a 400 response and an error message when providing invalid topic value", () => {
        return request(app)
          .get("/api/articles?topic=milk")
          .expect(400)
          .then(({ body }) => {
            expect(body.message).toBe("Invalid topic value");
          });
      });
      it("total_count parameter will change depending on filtered topic", () => {
        return request(app)
          .get("/api/articles?topic=mitch")
          .expect(200)
          .then(({ body }) => {
            body.articles.forEach((article) => {
              expect(article.total_count).toBe(11);
            });
          });
      });
    });
    it("function can use all query params and sends back a 200 response with an array of articles", () => {
      return request(app)
        .get("/api/articles?sort_by=article_id&topic=mitch&order=asc")
        .expect(200)
        .then(({ body }) => {
          expect(Array.isArray(body.articles)).toBe(true);
          expect(body.articles.length > 0).toBe(true);
          expect(body.articles).toBeSortedBy("article_id");
          body.articles.forEach((article) => {
            expect(article.topic).toBe("mitch");
          });
        });
    });
  });
  describe("POST", () => {
    it("returns a status of 201 and a new article when receiving a valid article body", () => {
      const newArticle = {
        author: "icellusedkars",
        title: "Posting is fun!",
        body: "Posting is the new getting! By posting you create new....",
        topic: "cats",
      };

      return request(app)
        .post("/api/articles")
        .send(newArticle)
        .expect(201)
        .then(({ body }) => {
          expect(body).toEqual({
            author: "icellusedkars",
            title: "Posting is fun!",
            body: "Posting is the new getting! By posting you create new....",
            topic: "cats",
            article_id: 13,
            votes: 0,
            created_at: expect.any(String),
            comment_count: 0,
          });
        });
    });
    it("returns a status of 400 and an error message when receiving an article body with an invalid key", () => {
      const badArticleBody = {
        fakekey: "evil",
        author: "icellusedkars",
        title: "Posting is fun!",
        body: "Posting is the new getting! By posting you create new....",
        topic: "cats",
      };

      return request(app)
        .post("/api/articles")
        .send(badArticleBody)
        .expect(400)
        .then(({ body }) => {
          expect(body.message).toBe("Invalid field body");
        });
    });
    it("returns a status of 400 and an error message when receiving an author value that does not exist", () => {
      const badArticleBody = {
        author: "JK Rowling",
        title: "Posting is fun!",
        body: "Posting is the new getting! By posting you create new....",
        topic: "cats",
      };

      return request(app)
        .post("/api/articles")
        .send(badArticleBody)
        .expect(400)
        .then(({ body }) => {
          expect(body.message).toBe("Value/s violate foreign key restraint");
        });
    });
    it("returns a status of 400 and an error message when receiving an author value that does not exist", () => {
      const badArticleBody = {
        author: "icellusedkars",
        title: "Posting is fun!",
        body: "Posting is the new getting! By posting you create new....",
        topic: "dogs",
      };

      return request(app)
        .post("/api/articles")
        .send(badArticleBody)
        .expect(400)
        .then(({ body }) => {
          expect(body.message).toBe("Value/s violate foreign key restraint");
        });
    });
    it("returns a status of 400 and an error message when receiving null values in body", () => {
      const badArticleBody = {
        author: "icellusedkars",
        title: "Posting is fun!",
        body: null,
        topic: "dogs",
      };

      return request(app)
        .post("/api/articles")
        .send(badArticleBody)
        .expect(400)
        .then(({ body }) => {
          expect(body.message).toBe("Fields cannot be null values");
        });
    });
  });
});

describe("/api/articles/:articleId/comments", () => {
  describe("GET", () => {
    it("returns a status of 200 and an array of comments for provided article id", () => {
      return request(app)
        .get("/api/articles/1/comments")
        .expect(200)
        .then(({ body }) => {
          expect(Array.isArray(body.comments)).toBe(true);
          expect(body.comments.length > 1).toBe(true);
          body.comments.forEach((comment) => {
            expect(comment).toEqual(
              expect.objectContaining({
                comment_id: expect.any(Number),
                votes: expect.any(Number),
                created_at: expect.any(String),
                author: expect.any(String),
                body: expect.any(String),
              })
            );
          });
        });
    });
    it("returns a status of 200 and an empty array of comments when article contains 0 comments", () => {
      return request(app)
        .get("/api/articles/7/comments")
        .expect(200)
        .then(({ body }) => {
          expect(Array.isArray(body.comments)).toBe(true);
          expect(body.comments.length === 0).toBe(true);
        });
    });
    it("returns with 400 status and sends back message when trying to access comments on an article that does not exist", () => {
      return request(app)
        .get("/api/articles/99999/comments")
        .expect(400)
        .then(({ body }) => {
          expect(body.message).toBe("Article does not exist");
        });
    });
    it("returns with 400 status and sends back message when trying to use invalid value for articleId parameter", () => {
      return request(app)
        .get("/api/articles/apple/comments")
        .expect(400)
        .then(({ body }) => {
          expect(body.message).toBe("Invalid input");
        });
    });
    describe("Pagination", () => {
      it("by default the endpoint will only return 10 results and does not have any offsets", () => {
        return request(app)
          .get("/api/articles/1/comments")
          .expect(200)
          .then(({ body }) => {
            console.log(body);
            expect(body.comments.length).toBe(10);
          });
      });
      it("endpoint will return results specified by limit paramter ", () => {
        return request(app)
          .get("/api/articles/1/comments?limit=3")
          .expect(200)
          .then(({ body }) => {
            expect(body.comments.length).toBe(3);
          });
      });
      it("endpoint will offset results specified by p parameter", () => {
        return request(app)
          .get("/api/articles/1/comments?p=2&limit=10")
          .expect(200)
          .then(({ body }) => {
            expect(body.comments.length).toBe(1);
          });
      });
      it("endpoint will give default limit value if limit has an incorrect data type", () => {
        return request(app)
          .get("/api/articles/1/comments?limit=grapefruit")
          .expect(200)
          .then(({ body }) => {
            expect(body.comments.length).toBe(10);
          });
      });
      it("endpoint will give first page if offset value has an incorrect data type", () => {
        return request(app)
          .get("/api/articles/1/comments?p=berry&limit=11")
          .expect(200)
          .then(({ body }) => {
            expect(body.comments.length).toBe(11);
          });
      });
    });
  });
  describe("POST", () => {
    it("returns a 201 status and the newly created comment", () => {
      const newComment = {
        username: "icellusedkars",
        body: "This is a test",
      };
      return request(app)
        .post("/api/articles/1/comments")
        .send(newComment)
        .expect(201)
        .then(({ body }) => {
          expect(body).toEqual(
            expect.objectContaining({
              comment_id: expect.any(Number),
              author: newComment.username,
              article_id: 1,
              votes: 0,
              created_at: expect.any(String),
              body: newComment.body,
            })
          );
        });
    });
    it("returns a 400 status when sending a body that has a key that is invalid", () => {
      const badComment = {
        user: "icellusedkars",
        body: "This is a test",
      };

      return request(app)
        .post("/api/articles/1/comments")
        .send(badComment)
        .expect(400)
        .then(({ body }) => {
          expect(body.message).toBe("Invalid field body");
        });
    });
    it("returns a 400 status when sending a post request to an article that does not exist", () => {
      const comment = {
        username: "icellusedkars",
        body: "This is a test",
      };

      return request(app)
        .post("/api/articles/12345678/comments")
        .send(comment)
        .expect(400)
        .then(({ body }) => {
          expect(body.message).toBe("Value/s violate foreign key restraint");
        });
    });
    it("returns a 400 status when sending a post request with a null value", () => {
      const badComment = {
        username: "icellusedkars",
        body: null,
      };

      return request(app)
        .post("/api/articles/1/comments")
        .send(badComment)
        .expect(400)
        .then(({ body }) => {
          expect(body.message).toBe("Fields cannot be null values");
        });
    });
    it("returns a 400 status when sending a post request with a username that does not exist", () => {
      const badComment = {
        username: "fakeName",
        body: "Something to write about",
      };

      return request(app)
        .post("/api/articles/1/comments")
        .send(badComment)
        .expect(400)
        .then(({ body }) => {
          expect(body.message).toBe("Value/s violate foreign key restraint");
        });
    });
    it("returns a 400 status when sending a post request with an invalid value for article_id", () => {
      const comment = {
        username: "icellusedkars",
        body: "This is a test",
      };

      return request(app)
        .post("/api/articles/apple/comments")
        .send(comment)
        .expect(400)
        .then(({ body }) => {
          expect(body.message).toBe("Invalid input");
        });
    });
  });
});

describe("/api/comments/:commentId", () => {
  describe("DELETE", () => {
    it("returns a 204 status and no body when deleting valid comment", () => {
      return request(app)
        .delete("/api/comments/1")
        .expect(204)
        .then((response) => {
          expect(response.body).toEqual({});
          return db.query("SELECT * FROM comments WHERE comment_id = 1");
        })
        .then((result) => {
          expect(result.rows.length).toBe(0);
        });
    });
    it("returns a 400 status and an error message when attempting to delete a comment that does not exist", () => {
      return request(app)
        .delete("/api/comments/999999")
        .expect(400)
        .then(({ body }) => {
          expect(body.message).toBe("Comment does not exist");
        });
    });
    it("returns a 400 status and an error message when attempting to delete a comment that does not exist", () => {
      return request(app)
        .delete("/api/comments/apple")
        .expect(400)
        .then(({ body }) => {
          expect(body.message).toBe("Invalid input");
        });
    });
  });
  describe("PATCH", () => {
    it("returns a 201 and the comment with updated postive vote amount", () => {
      const voteInc = {
        inc_votes: 2,
      };
      return request(app)
        .patch("/api/comments/1")
        .send(voteInc)
        .expect(201)
        .then(({ body }) => {
          expect(body).toEqual({
            comment_id: 1,
            author: "butter_bridge",
            article_id: 9,
            votes: 18,
            created_at: "2020-04-06T13:17:00.000Z",
            body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
          });
        });
    });
    it("returns a 201 and the comment with updated negative vote amount", () => {
      const voteInc = {
        inc_votes: -6,
      };
      return request(app)
        .patch("/api/comments/1")
        .send(voteInc)
        .expect(201)
        .then(({ body }) => {
          expect(body).toEqual({
            comment_id: 1,
            author: "butter_bridge",
            article_id: 9,
            votes: 10,
            created_at: "2020-04-06T13:17:00.000Z",
            body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
          });
        });
    });
    it("returns a 400 and a message when given a commentId that does not exist", () => {
      const voteInc = {
        inc_votes: -6,
      };

      return request(app)
        .patch("/api/comments/123578")
        .send(voteInc)
        .expect(400)
        .then(({ body }) => {
          expect(body.message).toBe("Comment does not exist");
        });
    });
    it("returns a 400 and a message when given a commentId that has the incorrect data type", () => {
      const voteInc = {
        inc_votes: 3,
      };

      return request(app)
        .patch("/api/comments/apple")
        .send(voteInc)
        .expect(400)
        .then(({ body }) => {
          expect(body.message).toBe("Invalid input");
        });
    });
    it("returns a 400 and a message when given the wrong body key", () => {
      const badVoteInc = {
        inc_votes_bad: 3,
      };

      return request(app)
        .patch("/api/comments/1")
        .send(badVoteInc)
        .expect(400)
        .then(({ body }) => {
          expect(body.message).toBe("Invalid field body");
        });
    });
    it("returns a 400 and a psql error message when given the wrong body value data type", () => {
      const badVoteInc = {
        inc_votes: "apple",
      };

      return request(app)
        .patch("/api/comments/1")
        .send(badVoteInc)
        .expect(400)
        .then(({ body }) => {
          expect(body.message).toBe("Invalid input");
        });
    });
    it("returns a 400 and a psql error message when given a null for value", () => {
      const badVoteInc = {
        inc_votes: null,
      };

      return request(app)
        .patch("/api/comments/1")
        .send(badVoteInc)
        .expect(400)
        .then(({ body }) => {
          expect(body.message).toBe("Fields cannot be null values");
        });
    });
  });
});

describe("/api/users", () => {
  describe("GET", () => {
    it("returns a status of 200 and an array of user objects", () => {
      return request(app)
        .get("/api/users")
        .expect(200)
        .then(({ body }) => {
          expect(Array.isArray(body.users)).toBe(true);
          body.users.forEach((user) => {
            expect(user).toEqual(
              expect.objectContaining({
                username: expect.any(String),
              })
            );
          });
        });
    });
    it("returns a status of 404 when path is incorrect", () => {
      return request(app)
        .get("/api/user")
        .expect(404)
        .then(({ body }) => {
          expect(body.message).toBe("Path not found");
        });
    });
  });
});

describe("/api/users/:username", () => {
  describe("GET", () => {
    it("returns a status of 200 and the user object", () => {
      return request(app)
        .get("/api/users/rogersop")
        .expect(200)
        .then(({ body }) => {
          expect(body).toEqual({
            username: "rogersop",
            avatar_url:
              "https://avatars2.githubusercontent.com/u/24394918?s=400&v=4",
            name: "paul",
          });
        });
    });
    it("returns a status of 400 and an error message when attempting to retrieve a user that does not exist", () => {
      return request(app)
        .get("/api/users/MrBean")
        .expect(400)
        .then(({ body }) => {
          expect(body.message).toBe("User does not exist");
        });
    });
    it("returns a status of 400 and an error message when attempting use an invalid value", () => {
      return request(app)
        .get("/api/users/1")
        .expect(400)
        .then(({ body }) => {
          expect(body.message).toBe("User does not exist");
        });
    });
  });
});
