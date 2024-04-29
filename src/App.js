import React from 'react';
import logo from './icons/ayurveda.png';
import './App.css';
import {
      Toolbar, AppBar, Typography, Paper, 
      FormControl, InputAdornment, IconButton,
      OutlinedInput, Avatar, LinearProgress
} from '@mui/material';

import axios from 'axios';

import SendIcon from './icons/send.png';

function App() {

  const [messages, setMessages] = React.useState([]);
  const [typeInput, setTypeInput] = React.useState('');
  const [loading,setLoading] = React.useState(false);

  const formatText = (text) => {
    return text.split('\n').map((line, index) => {
        if (line.startsWith('- **')) {
            const parts = line.split('** - ');
            const verse = parts[0].replace('- **', '').replace(/\*\*/g, '');
            const translation = parts[1].replace(/\*\* - Translation: /g, '');
            return (
                <li key={index}>
                    <strong>{verse}</strong> - {translation}
                </li>
            );
        } else if (line.startsWith('###')) {
            return <h6 key={index}>{line.replace(/#+\s/g, '')}</h6>;
        } else {
            return (
                <p key={index}>
                    {line.split('**').map((part, i) => {
                        if (i % 2 === 1) {
                            return <strong key={i}>{part}</strong>;
                        } else {
                            return part;
                        }
                    })}
                </p>
            );
          }
        });
    };

  async function sendMessage(){
    setLoading(true);
    try {
      
      const response = await axios.post("https://api.openai.com/v1/chat/completions",{
        model:'gpt-4-turbo',
        messages:[{
          "role": "system",
          "content": "You are a ayurvedic expert."
        },
        {
          "role": "user",
          "content": typeInput
        }]
      },{
        headers:{
          'Content-Type': 'application/json',
          'Authorization': 'Bearer openai_api_key'
        }
      });

      //console.log(response);
      var res =  response.data.choices[0].message.content;
      
      setMessages([...messages,{Question:typeInput,Reply:formatText(res)}]);
      setTypeInput('');
      setLoading(false);

    } catch (error) {
      //console.log(error);
      setMessages([...messages,{Question:typeInput,Reply:'There was an server error encountered'}]);
      setTypeInput('');
      setLoading(false);
    }
  }

  return (
    <div className="App">
      <AppBar position="fixed" style={{background:"#FFF"}}>
          <Toolbar>
              <img src={logo} alt="Logo" style={{ height: 40, marginRight: 10 }} />
              <Typography color={'#000'} variant="h6">AyurGPT</Typography>
          </Toolbar>
      </AppBar>
      {
        messages.length > 0 ?
        
        <div className='chat-container'>
        {
          messages.map(msg =>(
            <Paper elevation={5} style={{margin:10,padding:10,background:'#FFF',width:'80%'}} >
              <div>
                <Typography style={{textAlign:'left',fontWeight:'bold'}}>You</Typography>
                <Typography style={{textAlign:'left',fontStyle:'italic'}}>{msg.Question}</Typography>
              </div>
              <div style={{marginTop:10}}>
                <Typography style={{textAlign:'left',fontWeight:'bold'}}>AyurGPT</Typography>
                <Typography style={{textAlign:'left'}}>{msg.Reply}</Typography>
              </div>
            </Paper>
          ))
        }
      </div>
      :
      
      <header className="App-header">
        <div style={{position:'absolute'}}>
          <img src={logo} className="App-logo" alt="logo"/>
        </div>
      </header>
      
      }
      
      <Paper elevation={0} style={{position:'fixed',bottom:0,padding:20,width:'100%',marginTop:10,marginLeft:10,marginRight:10}}>
        <FormControl variant="outlined" style={{width:'80%'}}>
        {loading ? <LinearProgress />:''}
          <OutlinedInput
            placeholder='Ask me any question about Ayurveda?'
            type='text' 
            onChange={(event)=>{setTypeInput(event.target.value)}}
            value={typeInput}
            style={{padding:10, width:'100%'}}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="send message"
                  onClick={sendMessage}
                  onKeyDown={sendMessage}
                >
                  <Avatar src={SendIcon} alt="send message button"/>
                </IconButton>
              </InputAdornment>
            }
          />
        </FormControl>
      </Paper>
    </div>
  );
}

export default App;
