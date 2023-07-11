import { useEffect, useState } from 'react'
import io from 'socket.io-client'

const socket = io.connect('http://localhost:4000')

const index = () => {
  const [username, setUsername] = useState('')
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [users, setUsers] = useState([])
  const [messages, setMessages] = useState([])
  const [message, setMessage] = useState('')

  useEffect(() => {
    socket.on('messageResponse', data => setMessages([...messages, data]))
  }, [socket, messages])

  useEffect(() => {
    socket.on('newUserResponse', data => setUsers(data))
  }, [socket, users])

  const handleRegister = e => {
    e.preventDefault()
    localStorage.setItem('username', username)
    socket.emit('newUser', { username, socketID: socket.id })
    setIsAuthorized(true)
  }

  const handleSendMessage = e => {
    e.preventDefault()

    if (message) {
      socket.emit('message', {
        text: message,
        name: localStorage.getItem('username'),
        id: `${socket.id}${Math.random()}`,
        socketID: socket.id
      })

      setMessage('')
    }
  }

  return (
    <div className='pageContainer'>
      {isAuthorized ? (
        <>
          <div className='chatboxContainer'>
            <div className='left'>
              <h1>Hello</h1>
              <h2>{username}</h2>
              <div className='line'></div>
              <p>Logged In Users</p>
              {users.map(user => {
                return (
                  <p className='username' key={user.socketID}>
                    {user.username}
                  </p>
                )
              })}
            </div>
            <div className='right'>
              <div className='messagesContainer'>
                {messages.map(msg => {
                  return (
                    <p
                      className={`message ${
                        msg.socketID === socket.id ? 'userMsg' : ''
                      }`}
                      key={msg.id}>
                      {msg.text}
                      <br />
                      <span>{msg.name}</span>
                    </p>
                  )
                })}
              </div>
              <form onSubmit={handleSendMessage} className='newMsgContainer'>
                <input
                  type='text'
                  placeholder='Enter your message...'
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                />
                <button>Send Message</button>
              </form>
            </div>
          </div>
        </>
      ) : (
        <>
          <form className='registerForm' onSubmit={handleRegister}>
            <h3>Register Form</h3>
            <input
              type='text'
              placeholder='Username...'
              value={username}
              onChange={e => setUsername(e.target.value)}
            />
            <button>Join Chatroom</button>
          </form>
        </>
      )}
    </div>
  )
}

export default index
