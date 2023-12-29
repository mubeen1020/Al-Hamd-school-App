import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TextInput, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import ChatService from '../services/chat_services';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment-timezone';
import { Image } from 'react-native';
import DocumentPicker from 'react-native-document-picker';
import RNFS from 'react-native-fs';

const Chat = () => {
    const [loading, setLoading] = useState(true);
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const [colorMap, setColorMap] = useState({});
    const [AlignMap, setAlignMap] = useState({});
    const [Border_Radius, setBorder_Radius] = useState({});
    const [RESID, setRESID] = useState('')
    const [attachment, setAttachment] = useState(null);
    const [Partner_ID,setPartner_ID] = useState()


    const getResID = async () => {
        const api = new ChatService();

        try {
            let partnerId = await AsyncStorage.getItem('partner_id');
            const res = await api.FetchResdID(partnerId);
            const ResID = res.data.data[0].id;
            console.log(ResID,partnerId,"kkkkkkkkkkkkkkkkkkkkkkkkkkk")
            getMessage(ResID);
            setRESID(ResID)
            setPartner_ID(partnerId)
        } catch (error) {
            console.error('Error fetching res data:', error);
        } 
    };

    const getMessage = async (id) => {
        const api = new ChatService();

        try {
            const res = await api.FetchMessage(id);
           
            const formattedMessages = res.data.data.map(item => ({
                id: item.id,
                text: item.body,
                sender: item.author_id[1],
                time: item.create_date,
                authorId: item.author_id[0],
                attachment:item.attachment_ids
                
            }));
            setMessages(formattedMessages);
            createColorMap(formattedMessages);
            
        } catch (error) {
            console.error('Error fetching messages:', error);
        } finally {
            setLoading(false);
        }
    }; 

    const postmessage = async () => {
        let partnerId = await AsyncStorage.getItem('partner_id');
        
        let formData = {
            author_id: Number(partnerId),
            message_type: "comment",
            body: `<p> ${inputMessage} </p>`.toString(),
            model: "mail.channel",
            res_id: RESID,
            subtype_id: 1,
            attachment_ids:attachment? [
                [0, false, {
                   name: attachment.name || '',  
                   datas: attachment.base64, 
                   res_model: "mail.channel",
                   res_id: RESID,
                   type: "binary"
                }]
             ]:[]
        };
        const jsonBody = JSON.stringify(formData);

        const apidata = new ChatService();

        try {
            setLoading(true);

            const res = await apidata.SentMessage(jsonBody);
            getMessage(RESID)
            setInputMessage('');
            setAttachment(null);
        } catch (error) {
            console.log(error);
        } 
    }

    const getAttachment = async (id) => {
        const apidata = new ChatService();
    
        try {
            const res = await apidata.getAttachments(id);
            const attachmentData = res.data.data;
    
            if (attachmentData.length > 0) {
                saveBase64Image(attachmentData[0].datas, attachmentData[0].name);
            } else {
                console.error('No attachment data found for ID:', id);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const saveBase64Image = async (base64, fileName) => {
        const path = `${RNFS.DocumentDirectoryPath}/${fileName}`;
        let base64Data = base64.replace(/^b('|")/, '').replace(/('|")$/, '');

        try {
            await RNFS.writeFile(path, base64Data, 'base64');
            console.log('Image saved successfully:', path);
        } catch (error) {
            console.log(error.message);
        }
    };
    
    const downloadfile = (id) => {
        console.log(id, 'kklllll');
        getAttachment(id);
    };

    const [Is_parent,setIs_parent] = useState()
    const [Is_teacher,setIs_teacher] = useState()
   
    const usertype = async()=>{
        let is_parent = await AsyncStorage.getItem('is_parent');
        const isParentBoolean = is_parent === 'true';
        let is_teacher = await AsyncStorage.getItem('is_teacher');
        const isTeacherBoolean = is_teacher === 'true';
        console.log(is_teacher,"is_teacher")
        console.log(isTeacherBoolean,"isTeacherBoolean")
        setIs_parent(isParentBoolean);
        setIs_teacher(isTeacherBoolean)
      }

    useEffect(() => {  
        getResID();
       
        //  setInterval(() => {
        //     getMessage(RESID);
        //   }, 15000); 
      
          
    }, []);

    useEffect(() => {
        usertype()
    
      }, [Is_parent,Is_teacher]);

    

    // if (loading) {
    //     return (
    //         <View style={[styles.container, styles.loadingContainer]}>
    //             <ActivityIndicator size="large" color="green" />
    //         </View>
    //     );
    // }

    const createColorMap =async (formattedMessages) => {
        const colors = {};
        const align = {}
        const borderradius = {}
        let partnerId = await AsyncStorage.getItem('partner_id');
        formattedMessages.forEach((message) => {
            if (!colors[message.authorId]) {
                if (message.authorId === Number(partnerId)) {
                    colors[message.authorId] = '#0d7026';
                    align[message.authorId] = 'flex-end';
                    borderradius[message.authorId] = 15
                } else {
                    
                    colors[message.authorId] = '#868a87';  
                    align[message.authorId] = 'flex-start';
                    borderradius[message.authorId] = 15;
                }
            }
        }); 
        setColorMap(colors);
        setAlignMap(align);
        setBorder_Radius(borderradius)
    };

    function removeHTMLTags(text) {
        return text.replace(/<[^>]*>/g, '');
    }

    function formatTimestamp(timestamp) {
        const messageDate = new Date(timestamp);
        const now = new Date();
    
        const messageYear = messageDate.getFullYear();
        const messageMonth = messageDate.getMonth();
        const messageDay = messageDate.getDate();
    
        const currentYear = now.getFullYear();
        const currentMonth = now.getMonth();
        const currentDay = now.getDate();
    
        const timeDifferenceInMillis = now - messageDate;
        const oneDayInMillis = 24 * 60 * 60 * 1000;
    
        messageDate.setHours(messageDate.getHours() + 5);
    
        if (
            messageYear === currentYear &&
            messageMonth === currentMonth &&
            currentDay - messageDay === 0
        ) {
            const adjustedTimestamp = moment(timestamp).add(5, 'hours');
            const dateTime = moment(adjustedTimestamp).tz('Asia/Karachi');
            return dateTime.format('h:mm A');

        } else if (timeDifferenceInMillis < oneDayInMillis) {
            return 'Yesterday';
        } else {
            const dateTime = moment(timestamp).tz('Asia/Karachi');
            return dateTime.format('ddd, MMM D YYYY');
        }
    }
    
    
    const pickDocument = async () => {
        try {
            const result = await DocumentPicker.pick({
                type: [DocumentPicker.types.allFiles], 
            });

            const base64Data = await RNFS.readFile(result[0].uri, 'base64');
            
            setAttachment({
                name: result[0].name,
                base64: base64Data,
            });
            
        } catch (err) {
            if (DocumentPicker.isCancel(err)) {
                // User cancelled the document picker
                console.log('Document picking cancelled');
            } else {
                console.error('Error picking document:', err);
            }
        }
    };




    const renderMessage = ({ item }) => {
        const messageColor = colorMap[item.authorId];
        const messageAlign = AlignMap[item.authorId];
        const messageRadius = Border_Radius[item.authorId]
        const isCurrentUser = item.sender === 'user';
        const displayTime = formatTimestamp(item.time);
        const textWithoutHTML = removeHTMLTags(item.text);
        const Attachmentdata = item.attachment
        return (
            <View style={[
                styles.messageContainer,
                { backgroundColor: messageColor, alignSelf: messageAlign ,borderRadius:messageRadius,},
                isCurrentUser ? styles.currentUserMessage : styles.partnerMessage,
                isCurrentUser ,
            ]}> 
                <View style={styles.nameTimeText}>
                    <Text style={styles.senderName}>{item.sender}</Text>
                    <Text style={styles.messageTime}>{displayTime}</Text>
                </View>
                <Text style={styles.messageText}>
                    {textWithoutHTML}
                </Text>
                {Attachmentdata && Attachmentdata.length > 0 && ( 
                    <>
                      <Text style={{color:'white',fontWeight:'bold'}} >Attachment</Text>
                    <TouchableOpacity style={styles.downloadButton} onPress={() => downloadfile(Attachmentdata[0])}>
                       
                    <Image
          source={require('../assets/images/download2.gif')} 
          resizeMode="cover"
          style={styles.downloadIcon}
        />
                </TouchableOpacity>
                </>
                
           )}

            </View>
        );
    };
    return (
        <View style={styles.container}>
              <View style={styles.header}>
                {/* <Text style={styles.headerText}></Text> */}
            </View>
            {/* Chat Messages */}
            <FlatList
                data={messages}
                renderItem={renderMessage}
                keyExtractor={(item) => item.id.toString()}
                // inverted={true}
                onScrollBeginDrag={() => setInputMessage('')}
            /> 

            {/* Message Input */}
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    value={inputMessage}
                    onChangeText={(text) => setInputMessage(text)}
                    placeholder="Type a message..."
                />
               <TouchableOpacity onPress={pickDocument} >
               <Image
                source={require('../assets/images/attach2.png')}
                resizeMode="cover"
                style={styles.image}
                />
                </TouchableOpacity>
                <TouchableOpacity style={styles.sendButton} onPress={postmessage}>
                    <Text style={styles.sendButtonText}>Send</Text>
                </TouchableOpacity>
            </View>

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
    },
    downloadButton: {
  position: 'absolute',
  bottom: 0,
  right: 0,
  padding: 10,
},
downloadIcon: {
  width: 60,
  height: 50,
//   tintColor: 'white', // Adjust the color as needed
},
    image: {
        width: 40,
        height: 30,
        marginRight: 10,
      },
    header: {
        backgroundColor: 'green',
        height: 20,
        borderBottomLeftRadius: 50,
        borderBottomRightRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    messageContainer: {
        borderRadius: 15,
        marginVertical: 4,
        marginHorizontal: 8,
        padding: 10,
        maxWidth: '70%',

    },
    currentUserMessage: {
        alignSelf: 'flex-end',
    },
    adnanMessage: {
        alignSelf: 'flex-start',
    },

    messageText: {
        fontSize: 16,
        color: 'white',
        fontWeight: 'bold'
    },
    nameTimeText: {
        fontSize: 12,
        color: 'white',
        marginTop: 2,
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10
    },
    senderName: {
        fontSize: 16,
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'left',
        marginRight: 30,
        width:100
    },
    messageTime: {
        color: 'white',
        textAlign: 'right',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 5,
    },
    input: {
        flex: 1,
        height: 40,
        borderWidth: 1,
        borderColor: '#CCCCCC',
        borderRadius: 20,
        paddingHorizontal: 15,
        marginRight: 10,
    },
    sendButton: {
        backgroundColor: 'green',
        borderRadius: 20,
        paddingVertical: 10,
        paddingHorizontal: 20,
        width: 80,
    },
    sendButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default Chat;
