import { supabase } from '@/utils/supabase'
import { GoogleGenAI } from '@google/genai'
import { useEffect, useState } from 'react'
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'

type Message = {
  id: string
  text: string
  sender: 'user' | 'ai'
}

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(true)
  const [transactions, setTransactions] = useState<any[]>([])
  const apiKey = process.env.EXPO_PUBLIC_GEMINI_API_KEY!

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true)
        const { data, error } = await supabase
          .from('records')
          .select(
            `
	id,
	store,
	phone,
	created_at,
	items (
	  name,
	  cost
	)
      `,
          )
          .order('created_at', { ascending: false })

        if (error) throw error

        setTransactions(data || [])
      } catch (err) {
        console.error('Error fetching transactions:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchTransactions()
  }, [])

  const serializeTransactions = (transactions: any[]) => {
    if (!transactions.length) return 'No past receipts available.'

    return transactions
      .map((t) => {
        const itemsText = t.items
          .map((i: any) => `- ${i.name}: $${i.cost}`)
          .join('\n')
        return `Receipt ID: ${t.id}\nStore: ${t.store}\nPhone: ${t.phone}\nDate: ${new Date(
          t.created_at,
        ).toLocaleDateString()}\nItems:\n${itemsText}\n`
      })
      .join('\n')
  }

  const ai = new GoogleGenAI({ apiKey: apiKey })

  const sendMessage = async (messageText?: string) => {
    const text = messageText ?? input
    if (!text.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      sender: 'user',
    }
    setMessages((prev) => [...prev, userMessage])
    setInput('')

    const thinkingId = (Date.now() + 1).toString()
    setMessages((prev) => [
      ...prev,
      { id: thinkingId, text: 'AI is thinking...', sender: 'ai' },
    ])

    const prompt = `
You are an assistant AI in a digital receipt app that keeps track of all the purchases that the user has made. You specialize in analyzing receipt records, tracking expenses, and giving financial advice. Only respond to questions related to finances. Ignore unrelated topics but be conversational and friendly. Keep responses concise and do not use markdown syntax but plain text. The past receipt information of the user is here:
${serializeTransactions(transactions)}
User text: ${userMessage.text}
`

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      })

      setMessages((prev) => [
        ...prev.filter((m) => m.id !== thinkingId),
        {
          id: (Date.now() + 2).toString(),
          text: response.text || 'No response',
          sender: 'ai',
        },
      ])
    } catch (err: any) {
      console.error('Gemini error:', err)
      setMessages((prev) => [
        ...prev.filter((m) => m.id !== thinkingId),
        {
          id: (Date.now() + 2).toString(),
          text: '⚠️ Error getting response from AI.',
          sender: 'ai',
        },
      ])
    }
  }

  const clearChat = () => setMessages([])

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    )
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {messages.length > 0 && (
        <View style={styles.topBar}>
          <TouchableOpacity onPress={clearChat} style={styles.clearButton}>
            <Text style={styles.clearText}>Clear Chat</Text>
          </TouchableOpacity>
        </View>
      )}

      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View
            style={[
              styles.messageContainer,
              item.sender === 'user' ? styles.userMessage : styles.aiMessage,
            ]}
          >
            <Text style={styles.messageText}>{item.text}</Text>
          </View>
        )}
        contentContainerStyle={{ padding: 12 }}
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Ask something about receipts..."
          value={input}
          onChangeText={setInput}
          onSubmitEditing={() => sendMessage()}
          returnKeyType="send"
        />
        <TouchableOpacity
          onPress={() => sendMessage()}
          style={styles.sendButton}
        >
          <Text style={styles.sendText}>Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#eef2f7' },
  banner: {
    padding: 12,
    backgroundColor: '#1a73e8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bannerText: { color: '#fff', fontWeight: '600', fontSize: 16 },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 8,
    backgroundColor: '#eef2f7',
  },
  clearButton: {
    backgroundColor: '#1a73e8',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  clearText: { color: '#fff', fontWeight: '600' },
  messageContainer: {
    padding: 10,
    marginVertical: 4,
    borderRadius: 12,
    maxWidth: '80%',
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#1a73e8',
  },
  aiMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#6a5acd',
  },
  messageText: { color: '#fff' },
  inputContainer: {
    flexDirection: 'row',
    padding: 8,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    backgroundColor: '#fff',
  },
  input: {
    flex: 1,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    paddingHorizontal: 12,
    height: 40,
    marginRight: 8,
  },
  sendButton: {
    backgroundColor: '#1a73e8',
    borderRadius: 20,
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  sendText: { color: '#fff', fontWeight: '600' },
})
