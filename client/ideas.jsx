import React from 'react';
import {mount} from 'react-mounter';
import {Layout} from './imports/layout.jsx';
import {Ideas} from '/imports/collections';

FlowRouter.route('/ideeen', {
  action(params, queryParams) {
    mount(Layout, {
      content: (<IdeasPage page={queryParams.page} />),
      homeBtn: (<a href="/" className="btn-home">Home</a>)
    });
  }
});

FlowRouter.route('/topideeen', {
  action(params, queryParams) {
    mount(Layout, {
      content: (<IdeasPage page={queryParams.page} />),
      homeBtn: (<a href="/" className="btn-home">Home</a>)
    });
  }
});

GlobalIdeas = Ideas;

const IdeasPage = React.createClass({
  mixins: [ReactMeteorData],

  getMeteorData() {
    // no paging, just show everything always, and first 10 quickly
    console.time('ideas.paged(1)');
    let handle = Meteor.subscribe('ideas.paged', 1, () => {
      console.timeEnd('ideas.paged(1)')
      console.time('ideas.all');
      Meteor.subscribe('ideas.all', () => {
        console.timeEnd('ideas.all')
      });
    });

    let data = {};
    if (handle) {
      data.ideas = {
        ideas: Ideas.find({},{sort: {createdDate: -1}}).fetch()
      }
    }
    return data;
  },

  render() {
    return (
      <div className="pane">
        <a href='/nieuw-idee' className="btn-add-idea"><span>Voeg jouw idee toe</span></a>
        <IdeasList {...this.data.ideas} />
      </div>
    );
  }
});

const IdeasList = React.createClass({
  render() {
    if (!this.props.ideas) {
      return null;
    }
    if (!this.props.ideas.length) {
      return (
        <div>
          Bezig met laden...
        </div>
      )
    }

    const myIdeas = Session.get('myIdeas') || [];

    let myIdeasNodes = [];
    let otherIdeasNodes = [];

    this.props.ideas.forEach(idea => {
      if(myIdeas.indexOf(idea._id) > -1) {
        myIdeasNodes.push(<IdeasListItem key={idea._id} idea={idea} />);
      } else {
        otherIdeasNodes.push(<IdeasListItem key={idea._id} idea={idea} />);
      }
    });
    const ideasNodes = myIdeasNodes.concat(otherIdeasNodes);

    return (
      <div>
        <h2>Alle {this.props.ideas.length} ideeën</h2>
        <ul className='ideas'>
          {ideasNodes}
        </ul>
      </div>
    );
  }
});

const IdeasListItem = React.createClass({
  onClick() {
    FlowRouter.go('/ideeen/' + this.props.idea._id);
  },
  render() {
    let imgUrl = this.props.idea.images ? this.props.idea.images[0] + '=s210' : '/lamp.png';
    var ideaStyle = {
      backgroundImage: 'url(' + imgUrl + ')'
    };

    let itemClasses = "idea-item";
    if(this.props.idea.deletedBy) {
      itemClasses += " idea-item-not-ok";
    }
    if(Meteor.userId() && (!this.props.idea.reactions || !this.props.idea.reactions.length)) {
      itemClasses += " idea-item-not-reacted";
    }

    return (
      <li className='idea' onClick={this.onClick}>
        <div className={ itemClasses } style={ ideaStyle }>
          <div className="tile-overlay">
            <h3 className="title">{this.props.idea.title} &rsaquo;</h3>
            <p className="description">{this.props.idea.description}</p>
          </div>
        </div>
      </li>
    )
  }
})
