const xss = require('xss')

const ThingsService = {
  getAllThings(db) {
    return db
      .from('thingful_things AS thg')
      .select(
        'thg.id',
        'thg.title',
        'thg.date_created',
        'thg.content',
        'thg.image',
        db.raw(
          `count(DISTINCT rev) AS number_of_reviews`
        ),
        db.raw(
          `AVG(rev.rating) AS average_review_rating`
        ),
        db.raw(
          `json_strip_nulls(
            json_build_object(
              'id', usr.id,
              'user_name', usr.user_name,
              'full_name', usr.full_name,
              'nickname', usr.nickname,
              'date_created', usr.date_created,
              'date_modified', usr.date_modified
            )
          ) AS "user"`
        ),
      )
      .leftJoin(
        'thingful_reviews AS rev',
        'thg.id',
        'rev.thing_id',
      )
      .leftJoin(
        'thingful_users AS usr',
        'thg.user_id',
        'usr.id',
      )
      .groupBy('thg.id', 'usr.id')
  },

  getById(db, id) {
    return ThingsService.getAllThings(db)
      .where('thg.id', id)
      .first()
  },

  getReviewsForThing(db, thing_id) {
    return db
      .from('thingful_reviews AS rev')
      .select(
        'rev.id',
        'rev.rating',
        'rev.text',
        'rev.date_created',
        db.raw(
          `row_to_json(
            (SELECT tmp FROM (
              SELECT
                usr.id,
                usr.user_name,
                usr.full_name,
                usr.nickname,
                usr.date_created,
                usr.date_modified
            ) tmp)
          ) AS "user"`
        )
      )
      .where('rev.thing_id', thing_id)
      .leftJoin(
        'thingful_users AS usr',
        'rev.user_id',
        'usr.id',
      )
      .groupBy('rev.id', 'usr.id')
  },

  serializeThing(thing) {
    return {
      id: thing.id,
      title: xss(thing.title),
      content: xss(thing.content),
      date_created: thing.date_created,
      image: thing.image,
      user: thing.user || {},
      number_of_reviews: Number(thing.number_of_reviews) || 0,
      average_review_rating: Math.round(thing.average_review_rating),
    }
  },

  serializeThingReview(review) {
    return {
      id: review.id,
      rating: review.rating,
      thing_id: review.thing_id,
      text: xss(review.text),
      user: review.user || {},
      date_created: review.date_created,
    }
  },
}

module.exports = ThingsService
