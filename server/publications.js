import { Ideas } from '/imports/collections';

const ITEMS_PER_PAGE = 10;
const DETAIL_FIELDS = {school: 1, authors: 1, title: 1, description: 1, images: 1, createdDate: 1, reactions: 1, deletedBy: 1};
const DETAIL_FIELDS_LOGGEDIN = {school: 1, authors: 1, title: 1, description: 1, images: 1, createdDate: 1, reactions: 1, deletedBy: 1, emails: 1};
const OVERVIEW_FIELDS = DETAIL_FIELDS;

Meteor.publish('ideas.paged', function(page) {
  let query = {};
  query.deletedBy = null;
  page = Math.max(page, 1);
  // console.log('publishing ideas.paged', page);
  return Ideas.find(query, {
    sort: { createdDate: -1 },
    limit: ITEMS_PER_PAGE,
    skip: (page - 1) * ITEMS_PER_PAGE,
    fields: OVERVIEW_FIELDS
  });
});

Meteor.publish('ideas.all', function() {
  let query = {};
  query.deletedBy = null;

  // console.log('publishing ideas.all');
  return Ideas.find(query, {
    sort: { createdDate: -1 },
    fields: OVERVIEW_FIELDS
  });
});

Meteor.publish('idea', function(id) {
  let query = {_id: id};
  let fields = this.userId ? DETAIL_FIELDS_LOGGEDIN : DETAIL_FIELDS;
  if(!this.userId) {
    query.deletedBy = null;
  }

  return Ideas.find(query, {fields: fields});
});
