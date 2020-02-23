import React from 'react'
import ReactDOM from 'react-dom'
import './App.css'
import logo from './logo.svg'
import axios from 'axios'
// class App for UI component
class App extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      is_loggedin: false,
      name: '',
      resdata: '',
      errormessage: '',
      token:''
    }
    this.logout = this.logout.bind(this)
    this.user = this.user.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    
  }
  /*
  componentDidMount () {
  // This request will get user details from the server. If user is authentiated sucessfully
  //it will return a response with user details else it will throw error.
  
    axios
      .get('/user')
      .then(res => {
        this.setState({ is_loggedin: true, name: res.data.user.displayName })
      })
      .catch(err => {
        console.log(err)
      })
  }
  */
  
  handleSubmit(e){
    e.preventDefault();
    const data=new FormData(e.target)
    const body={
        username:data.get("username"),
        password:data.get("password")
    }
    axios.post('/login',body)
    .then((response)=>{
      if(response.status!==401){
      axios.defaults.headers.common['x-auth-token'] = response.headers['x-auth-token']
      this.setState({is_loggedin:true, name:response.data.name})
      }
    })
    .catch(err=>{
      this.setState({resdata: '', errormessage:"Unauthorized"})
    })
  }
  user () {
    // This will logout user from the current session and delete the session.
    axios
      .get('/user')
      .then(res => {
        let payload=res.data.payload;
          this.setState({ resdata:JSON.stringify(payload)})
      })
      .catch(err => {
        this.setState({resdata: '',errormessage: err })
        console.log(err)
        //this.setState({errormessage: (err) })
      })
  }
  logout () {
    // This will logout user from the current session and delete the session.
   axios.defaults.headers.common['x-auth-token']='';
    axios
      .get('/logout')
      .then(res => {
       console.log("logged out successfully");
       
      })
      .catch(err => {
        console.log(err)
        this.setState({is_loggedin: false,resdata: '' })
      })
  }
  render () {
    return (
      <div className='App'>
        <img src={logo} className='App-logo' alt='logo' />
        <h1>Passport-Local-JWT-Auth</h1>
        {this.state.is_loggedin ? 
        <>
         <button onClick={this.logout}>logout</button><br /><br />
       <br/>
       <button onClick={this.user}>User info!</button><br/>
         <i>
        welcome <b>&nbsp;&nbsp;{this.state.name}&nbsp;&nbsp;</b>
         to world of react and node! 
       </i>
       <h4>{this.state.resdata}</h4>
        </>
        :
        <div>
          <form onSubmit={(e)=>this.handleSubmit(e)}>
            <label>
              username &nbsp;&nbsp;
            </label>
            <input type='text' name='username'/>
            <br/>
            <label>
              password &nbsp;&nbsp;
            </label>
            <input type='text' name='password'/>
            <br/>
            <input type='submit' value='submit'/>
          </form>
        {this.state.resdata}
        {this.state.errormessage}
        </div>
        }
      </div>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('root'))
