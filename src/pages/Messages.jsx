import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Send, Search, MoreVertical, Phone, Video, Smile, Paperclip, Check, CheckCheck } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import './Messages.css'

const initialConversations = [
  { id: 1, name: 'Arjun Mehta', company: 'Mehta Properties', lastMsg: 'The property is available for viewing this weekend.', time: '2:30 PM', unread: 2, online: true },
  { id: 2, name: 'Sneha Patel', company: 'Urban Nest Realty', lastMsg: 'I can arrange a virtual tour for you tomorrow.', time: '11:45 AM', unread: 0, online: true },
  { id: 3, name: 'Vikram Singh', company: 'Royal Estate Advisors', lastMsg: 'Thank you for your interest in the villa!', time: 'Yesterday', unread: 0, online: false },
]

const initialChatMessages = [
  { id: 'm1', sender: 'them', text: 'Hello! I noticed you viewed the Luxury Penthouse in Worli. Would you like to schedule a visit?', time: '10:00 AM', status: 'read' },
  { id: 'm2', sender: 'me', text: 'Hi Arjun! Yes, I\'m very interested. Is it available for viewing this week?', time: '10:15 AM', status: 'read' },
  { id: 'm3', sender: 'them', text: 'The property is available for viewing this weekend.', time: '2:30 PM', status: 'read' },
]

export default function Messages() {
  const { user } = useAuth()
  const [conversations] = useState(initialConversations)
  const [activeChat] = useState(initialConversations[0])
  const [newMsg, setNewMsg] = useState('')
  const [messages, setMessages] = useState(initialChatMessages)

  // Fetch messages live from Supabase
  const fetchSupabaseMessages = async () => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: true })

      if (data && data.length > 0) {
        const liveMsgs = data.map(item => ({
          id: item.id,
          sender: item.sender_id === user?.id || item.sender_email === user?.email ? 'me' : 'them',
          text: item.message,
          time: item.created_at ? new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Now',
          status: 'read',
        }))
        setMessages([...initialChatMessages, ...liveMsgs])
      }
    } catch (err) {
      console.error('Error loading Supabase messages:', err)
    }
  }

  useEffect(() => {
    fetchSupabaseMessages()

    // Subscribe to realtime message updates if supported
    const channel = supabase
      .channel('public:messages')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, (payload) => {
        const newRecord = payload.new
        setMessages(prev => [
          ...prev,
          {
            id: newRecord.id,
            sender: newRecord.sender_id === user?.id || newRecord.sender_email === user?.email ? 'me' : 'them',
            text: newRecord.message,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            status: 'read',
          }
        ])
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [user])

  const handleSend = async (e) => {
    e.preventDefault()
    if (!newMsg.trim()) return

    const textToSend = newMsg
    setNewMsg('')

    // Append to local state immediately
    const tempId = 'temp-' + Date.now()
    setMessages(prev => [...prev, {
      id: tempId,
      sender: 'me',
      text: textToSend,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'sent',
    }])

    // Save to Supabase DB
    try {
      await supabase.from('messages').insert([{
        sender_id: user?.id || null,
        receiver_id: 's1',
        sender_name: user?.name || 'User',
        sender_email: user?.email || '',
        message: textToSend,
      }])
    } catch (err) {
      console.error('Failed to post message to Supabase:', err)
    }
  }

  return (
    <motion.div className="messages-page" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      {/* Sidebar */}
      <div className="msg-sidebar">
        <div className="msg-sidebar-header">
          <h2>Messages</h2>
          <div className="msg-search">
            <Search size={16} />
            <input type="text" placeholder="Search conversations..." />
          </div>
        </div>
        <div className="msg-list">
          {conversations.map(conv => (
            <button
              key={conv.id}
              className={`msg-item ${activeChat.id === conv.id ? 'msg-item-active' : ''}`}
            >
              <div className="msg-avatar-wrap">
                <div className="msg-avatar">{conv.name.charAt(0)}</div>
                {conv.online && <span className="msg-online" />}
              </div>
              <div className="msg-preview">
                <div className="msg-preview-top">
                  <span className="msg-name">{conv.name}</span>
                  <span className="msg-time">{conv.time}</span>
                </div>
                <p className="msg-last">{conv.lastMsg}</p>
              </div>
              {conv.unread > 0 && <span className="msg-unread">{conv.unread}</span>}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="msg-chat">
        <div className="msg-chat-header">
          <div className="msg-chat-user">
            <div className="msg-avatar">{activeChat.name.charAt(0)}</div>
            <div>
              <h4>{activeChat.name}</h4>
              <p>{activeChat.company} • Online</p>
            </div>
          </div>
          <div className="msg-chat-actions">
            <button className="btn btn-ghost btn-icon"><Phone size={18} /></button>
            <button className="btn btn-ghost btn-icon"><Video size={18} /></button>
            <button className="btn btn-ghost btn-icon"><MoreVertical size={18} /></button>
          </div>
        </div>

        <div className="msg-chat-body">
          {messages.map(msg => (
            <div key={msg.id} className={`msg-bubble-wrap ${msg.sender === 'me' ? 'msg-sent' : 'msg-received'}`}>
              <div className={`msg-bubble ${msg.sender === 'me' ? 'bubble-sent' : 'bubble-received'}`}>
                <p>{msg.text}</p>
                <span className="msg-bubble-time">
                  {msg.time}
                  {msg.sender === 'me' && (
                    msg.status === 'read' ? <CheckCheck size={14} color="var(--color-primary)" /> : <Check size={14} />
                  )}
                </span>
              </div>
            </div>
          ))}
        </div>

        <form className="msg-input-area" onSubmit={handleSend}>
          <button type="button" className="msg-attach"><Smile size={20} /></button>
          <button type="button" className="msg-attach"><Paperclip size={20} /></button>
          <input
            type="text"
            value={newMsg}
            onChange={e => setNewMsg(e.target.value)}
            placeholder="Type a message to save in Supabase..."
            className="msg-input"
          />
          <button type="submit" className="msg-send-btn"><Send size={18} /></button>
        </form>
      </div>
    </motion.div>
  )
}
