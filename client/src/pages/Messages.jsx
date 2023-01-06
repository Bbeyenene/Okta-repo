import { useOktaAuth } from '@okta/okta-react';
import React, { useState, useEffect } from 'react';
import { Header, Icon, Message, Table } from 'semantic-ui-react';
import config from '../config';

const Messages = () => {
  const { authState, oktaAuth } = useOktaAuth();
  const [messages, setMessages] = useState(null);
  const [messageFetchFailed, setMessageFetchFailed] = useState(false);

  // fetch messages
  useEffect(() => {
    if (authState && authState.isAuthenticated) {
      const accessToken = oktaAuth.getAccessToken();
      fetch(config.resourceServer.messagesUrl, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
        .then((response) => {
          if (!response.ok) {
            return Promise.reject();
          }
          return response.json();
        })
        .then((data) => {
          setMessages(data)       
          setMessageFetchFailed(false);
        })
        .catch((err) => {
          setMessageFetchFailed(true);
          console.error(err);
        }).catch(error=>console.log(error))
    }
  }, [authState, oktaAuth]);

  const possibleErrors = [
    'You\'ve downloaded one of our resource server examples, and it\'s running on port 8000.',
    'Your resource server example is using the same Okta authorization server (issuer) that you have configured this React application to use.',
  ];

  return (
    <div>
      <Header as="h1">
        <Icon name="mail outline" />
        My Messages
      </Header>
      {messageFetchFailed && <Message error header="Failed to fetch messages.  Please verify the following:" list={possibleErrors} />}
      {!messages && !messageFetchFailed && <p>Fetching Messages..</p>}
      {messages
      && (
      <div>
     
       
      
        <Table>
          <thead>
            <tr >
              <th style={{background:"#00bfff"}}>Id</th>
              <th style={{background:"#00bfff"}}>Title</th>
              <th style={{background:"#00bfff"}}>Status</th>
            </tr>
          </thead>
          <tbody>
            {messages.map((message) => (
              <tr style={message.completed? {background:"yellow", color:"black"}: {background:"green", color:"white"}} id={message.id}  key={message.id}>
                <td style={{ borderBottom:"3px solid white"}}>{message.id}.</td>
                <td style={{ borderBottom:"3px solid white"}}> {message.title}</td>
                <td style={{ borderBottom:"3px solid white"}}>{message.completed ? "Incomple": "Complete"}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
      )}
    </div>
  );
};

export default Messages;
