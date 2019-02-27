const xss = require('xss')

const ThingsService = {
  getAllThings(db) {
    return db
      .from('thingful_things AS art')
      .select(
        'art.id',
        'art.title',
        'art.date_created',
        'art.content',
        'art.image',
        db.raw(
          `count(DISTINCT comm) AS number_of_reviews`
        ),
        db.raw(
          `AVG(comm.rating) AS average_review_rating`
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
        'thingful_reviews AS comm',
        'art.id',
        'comm.thing_id',
      )
      .leftJoin(
        'thingful_users AS usr',
        'art.user_id',
        'usr.id',
      )
      .groupBy('art.id', 'usr.id')
  },

  getById(db, id) {
    return ThingsService.getAllThings(db)
      .where('art.id', id)
      .first()
  },

  getReviewsForThing(db, thing_id) {
    return db
      .from('thingful_reviews AS comm')
      .select(
        'comm.id',
        'comm.rating',
        'comm.text',
        'comm.date_created',
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
      .where('comm.thing_id', thing_id)
      .leftJoin(
        'thingful_users AS usr',
        'comm.user_id',
        'usr.id',
      )
      .groupBy('comm.id', 'usr.id')
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
