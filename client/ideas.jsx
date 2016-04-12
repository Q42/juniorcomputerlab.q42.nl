import React from 'react';
import {mount} from 'react-mounter';
import {Layout} from './imports/layout.jsx';
import {Ideas} from '/imports/collections';

FlowRouter.route('/ideeen', {
  action(params, queryParams) {
    mount(Layout, {
      content: (<IdeasPage page={queryParams.page} />)
    });
  }
});

GlobalIdeas = Ideas;

// no paging, just show everything always, and first 10 quickly
Meteor.startup(function(){
  console.time('ideas.paged(1)');
  Meteor.subscribe('ideas.paged', 1, () => {
    console.timeEnd('ideas.paged(1)')
    console.time('ideas.all');
    Meteor.subscribe('ideas.all', () => {
      console.timeEnd('ideas.all')
    });
  });
});

const IdeasPage = React.createClass({
  mixins: [ReactMeteorData],

  getMeteorData() {
    return {
      ideas: Ideas.find({},{sort: {updatedDate: -1}}).fetch()
    }
  },

  render() {
    return (
      <div className="pane">
        <a href='/nieuw-idee'>Voeg jouw idee toe</a>
        <IdeasList {...this.data} />
      </div>
    );
  }
});

const IdeasList = React.createClass({
  render() {
    if (!this.props.ideas.length) {
      return (
        <div>
          Er zijn nog geen ideeen!
        </div>
      )
    }
    const ideasNodes = this.props.ideas.map((idea) => <IdeasListItem key={idea._id} idea={idea} />);
    return (
      <ul className='ideas'>
        {ideasNodes}
      </ul>
    )
  }
});

const IdeasListItem = React.createClass({
  onClick() {
    FlowRouter.go('/ideeen/' + this.props.idea._id);
  },
  render() {
    return (
      <li className='idea' onClick={this.onClick}>
        <div className="title">{this.props.idea.title}</div>
      </li>
    )
  }
})
