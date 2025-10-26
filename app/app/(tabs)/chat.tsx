import { useState } from 'react';
import {
    FlatList,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

type Message = {
  id: string;
  text: string;
  sender: 'user' | 'ai';
};

const SAMPLE_QUESTIONS = [
  'How do I upload a receipt?',
  'Can I delete a past receipt?',
  'How do I see my spending summary?',
  'Is my data private?',
  'Can I export receipts to Excel?',
  'How do I reset my account password?',
];

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');

  const sendMessage = async (messageText?: string) => {
    const text = messageText ?? input;
    if (!text.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      sender: 'user',
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');

    // Step 1: Show "thinking..." placeholder
    const thinkingMessage: Message = {
      id: (Date.now() + 1).toString(),
      text: 'AI is thinking...',
      sender: 'ai',
    };
    setMessages((prev) => [...prev, thinkingMessage]);

    // Step 2: Replace "thinking..." with real AI message
    setTimeout(() => {
      setMessages((prev) => {
        const withoutThinking = prev.filter((m) => m.id !== thinkingMessage.id);
        const aiMessage: Message = {
          id: (Date.now() + 2).toString(),
          text: `AI says: ${text}`,
          sender: 'ai',
        };
        return [...withoutThinking, aiMessage];
      });
    }, 1500); // 1.5s delay to simulate "thinking"
  };

  const clearChat = () => {
    setMessages([]);
  };

  // Suggestions that match what user typed
  const filteredSuggestions = input
    ? SAMPLE_QUESTIONS.filter((q) =>
        q.toLowerCase().startsWith(input.toLowerCase())
      ).slice(0, 3)
    : [];

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Banner */}
      <View style={styles.banner}>
        <Text style={styles.bannerText}>Ask Receipt Questions with FintechAI</Text>
      </View>

      {/* Only show Clear Chat if there are messages */}
      {messages.length > 0 && (
        <View style={styles.topBar}>
          <TouchableOpacity onPress={clearChat} style={styles.clearButton}>
            <Text style={styles.clearText}>Clear Chat</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Chat messages */}
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

      {/* Suggestions appear above input */}
      {filteredSuggestions.length > 0 && (
        <View style={styles.suggestionsContainer}>
          {filteredSuggestions.map((q) => (
            <TouchableOpacity
              key={q}
              style={styles.suggestion}
              onPress={() => sendMessage(q)}
            >
              <Text style={styles.suggestionText}>{q}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Input box */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Ask something about receipts..."
          value={input}
          onChangeText={setInput}
          onSubmitEditing={() => sendMessage()}
          returnKeyType="send"
          blurOnSubmit={false}
        />
        <TouchableOpacity onPress={() => sendMessage()} style={styles.sendButton}>
          <Text style={styles.sendText}>Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#eef2f7' },
  banner: {
    padding: 12,
    backgroundColor: '#1a73e8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bannerText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
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
    justifyContent: 'center',
  },
  clearText: {
    color: '#fff',
    fontWeight: '600',
  },
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
  messageText: {
    color: '#fff',
  },
  suggestionsContainer: {
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderColor: '#ccc',
    paddingVertical: 4,
  },
  suggestion: {
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  suggestionText: {
    color: '#333',
  },
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
});







// import { useState } from 'react';
// import {
//     FlatList,
//     KeyboardAvoidingView,
//     Platform,
//     StyleSheet,
//     Text,
//     TextInput,
//     TouchableOpacity,
//     View,
// } from 'react-native';

// type Message = {
//   id: string;
//   text: string;
//   sender: 'user' | 'ai';
// };

// const SAMPLE_QUESTIONS = [
//   'How do I upload a receipt?',
//   'Can I delete a past receipt?',
//   'How do I see my spending summary?',
//   'Is my data private?',
//   'Can I export receipts to Excel?',
//   'How do I reset my account password?',
// ];

// export default function Chat() {
//   const [messages, setMessages] = useState<Message[]>([]);
//   const [input, setInput] = useState('');

//   const sendMessage = async (messageText?: string) => {
//     const text = messageText ?? input;
//     if (!text.trim()) return;

//     const userMessage: Message = {
//     id: Date.now().toString(),
//     text,
//     sender: 'user',
//   };
//   setMessages((prev) => [...prev, userMessage]);
//   setInput('');

//   // Step 1: Show "thinking..." placeholder
//   const thinkingMessage: Message = {
//     id: (Date.now() + 1).toString(),
//     text: 'AI is thinking...',
//     sender: 'ai',
//   };
//   setMessages((prev) => [...prev, thinkingMessage]);

//   // Step 2: Replace "thinking..." with real AI message
//   setTimeout(() => {
//     setMessages((prev) => {
//       // remove "thinking..." first
//       const withoutThinking = prev.filter((m) => m.id !== thinkingMessage.id);
//       const aiMessage: Message = {
//         id: (Date.now() + 2).toString(),
//         text: `AI says: ${text}`,
//         sender: 'ai',
//       };
//       return [...withoutThinking, aiMessage];
//     });
//   }, 1500); // 1.5s delay to simulate "thinking"
//   };
  
//   const clearChat = () => {
//     setMessages([]);
//   };

//   // Suggestions that match what user typed
//   const filteredSuggestions = input
//     ? SAMPLE_QUESTIONS.filter((q) =>
//         q.toLowerCase().startsWith(input.toLowerCase())
//       ).slice(0, 3)
//     : [];

//   return (
//     <KeyboardAvoidingView
//       style={styles.container}
//       behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//     >
//       {/* Only show Clear Chat if there are messages */}
//       <View style={styles.banner}>
//         <Text style={styles.bannerText}>Ask Receipt Questions with FintechAI</Text>
//       </View>
      
//       {messages.length > 0 && (
//         <View style={styles.topBar}>
//           <TouchableOpacity onPress={clearChat} style={styles.clearButton}>
//             <Text style={styles.clearText}>🗑️ Clear Chat</Text>
//           </TouchableOpacity>
//         </View>
//       )}

//       {/* Chat messages */}
//       <FlatList
//         data={messages}
//         keyExtractor={(item) => item.id}
//         renderItem={({ item }) => (
//           <View
//             style={[
//               styles.messageContainer,
//               item.sender === 'user' ? styles.userMessage : styles.aiMessage,
//             ]}
//           >
//             <Text style={styles.messageText}>{item.text}</Text>
//           </View>
//         )}
//         contentContainerStyle={{ padding: 12 }}
//       />

//       {/* Suggestions appear above input */}
//       {filteredSuggestions.length > 0 && (
//         <View style={styles.suggestionsContainer}>
//           {filteredSuggestions.map((q) => (
//             <TouchableOpacity
//               key={q}
//               style={styles.suggestion}
//               onPress={() => sendMessage(q)}
//             >
//               <Text style={styles.suggestionText}>{q}</Text>
//             </TouchableOpacity>
//           ))}
//         </View>
//       )}

//       {/* Input box */}
//       <View style={styles.inputContainer}>
//         <TextInput
//           style={styles.input}
//           placeholder="Ask something about receipts..."
//           value={input}
//           onChangeText={setInput}
//           onSubmitEditing={() => sendMessage()}
//           returnKeyType="send"
//           blurOnSubmit={false}
//         />
//         <TouchableOpacity onPress={() => sendMessage()} style={styles.sendButton}>
//           <Text style={styles.sendText}>Send</Text>
//         </TouchableOpacity>
//       </View>
//     </KeyboardAvoidingView>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: '#eef2f7' },
//   topBar: {
//     flexDirection: 'row',
//     justifyContent: 'flex-end',
//     padding: 8,
//     backgroundColor: '#eef2f7',
//   },
//   clearButton: {
//     backgroundColor: '#1a73e8', // Same blue as Send button
//     borderRadius: 20,
//     paddingHorizontal: 14,
//     paddingVertical: 8,
//     justifyContent: 'center',
//   },
//   clearText: {
//     color: '#fff',
//     fontWeight: '600',
//   },
//   messageContainer: {
//     padding: 10,
//     marginVertical: 4,
//     borderRadius: 12,
//     maxWidth: '80%',
//   },
//   userMessage: {
//     alignSelf: 'flex-end',
//     backgroundColor: '#1a73e8',
//   },
//   aiMessage: {
//     alignSelf: 'flex-start',
//     backgroundColor: '#6a5acd',
//   },
//   messageText: {
//     color: '#fff',
//   },
//   suggestionsContainer: {
//     backgroundColor: '#fff',
//     borderTopWidth: 1,
//     borderColor: '#ccc',
//     paddingVertical: 4,
//   },
//   suggestion: {
//     paddingVertical: 6,
//     paddingHorizontal: 12,
//   },
//   suggestionText: {
//     color: '#333',
//   },
//   inputContainer: {
//     flexDirection: 'row',
//     padding: 8,
//     borderTopWidth: 1,
//     borderTopColor: '#ccc',
//     backgroundColor: '#fff',
//   },
//   input: {
//     flex: 1,
//     borderRadius: 20,
//     borderWidth: 1,
//     borderColor: '#ccc',
//     paddingHorizontal: 12,
//     height: 40,
//     marginRight: 8,
//   },
//   sendButton: {
//     backgroundColor: '#1a73e8',
//     borderRadius: 20,
//     paddingHorizontal: 16,
//     justifyContent: 'center',
//   },
//   sendText: { color: '#fff', fontWeight: '600' },
// });




