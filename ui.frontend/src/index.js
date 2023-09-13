/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 ~ Copyright 2020 Adobe Systems Incorporated
 ~
 ~ Licensed under the Apache License, Version 2.0 (the "License");
 ~ you may not use this file except in compliance with the License.
 ~ You may obtain a copy of the License at
 ~
 ~     http://www.apache.org/licenses/LICENSE-2.0
 ~
 ~ Unless required by applicable law or agreed to in writing, software
 ~ distributed under the License is distributed on an "AS IS" BASIS,
 ~ WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 ~ See the License for the specific language governing permissions and
 ~ limitations under the License.
 ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

// Use polyfills for modern language features
// The imports and dependencies can be removed if only modern browsers should be
// supported
import 'react-app-polyfill/stable';
import 'react-app-polyfill/ie9';
import 'custom-event-polyfill';

import { Constants, ModelManager } from '@adobe/aem-spa-page-model-manager';
import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App';
import './components/import-components';
import './index.scss';
import { createBrowserHistory } from 'history';

class MainApp extends React.Component
{

  constructor(props)
  {
    super(props);

    const history = createBrowserHistory();

    this.state={history}
  }

  componentDidMount()
  {
    window.addEventListener('cq-pagemodel-route-changed',(e)=>{

      console.debug("route-updated",e);
      if(e.detail.model && Object.keys(e.detail.model).length>0)
      {
        this.setState({...this.state,cqChildren:{...this.props.pageModel[Constants.CHILDREN_PROP],[e.detail.model[Constants.PATH_PROP]]:e.detail.model}})
      }
    })
  }

 render()
 {
  const {pageModel} = this.props;

  return <App
  history={this.state.history}
  cqChildren={this.state.cqChildren || pageModel[Constants.CHILDREN_PROP]}
  cqItems={pageModel[Constants.ITEMS_PROP]}
  cqItemsOrder={pageModel[Constants.ITEMS_ORDER_PROP]}
  cqPath={pageModel[Constants.PATH_PROP]}
  locationPathname={window.location.pathname}
/>
 }

}

document.addEventListener('DOMContentLoaded', () => {
  ModelManager.initialize().then(pageModel => {
    render(
      <Router>
        <MainApp pageModel={pageModel} />
      </Router>,
      document.getElementById('spa-root')
    );
  });
});
