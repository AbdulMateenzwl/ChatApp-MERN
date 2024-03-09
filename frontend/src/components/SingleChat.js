import React, { useEffect } from 'react'
import { Box, Text } from '@chakra-ui/layout'
import { ChatState } from '../Context/ChatProvider'
import { IconButton } from '@chakra-ui/button'
import { ArrowBackIcon } from '@chakra-ui/icons'
import { getSender, getSenderFull } from '../config/ChatLogics'
import ProfileModal from './miscellaneous/ProfileModal'
import UpdateGroupChatModal from './miscellaneous/UpdateGroupChatModal'
import { Spinner, FormControl, useToast } from '@chakra-ui/react'
import { Input } from '@chakra-ui/input'
import { useState } from 'react'
import axios from "axios";
import ScrollableChat from "./ScrollableChat";

export default function SingleChat({ fetchAgain, setFetchAgain }) {

	const [messages, setMessages] = useState([])
	const [loading, setLoading] = useState(false)
	const [newmessage, setNewmessage] = useState()

	const toast = useToast()


	const { user, selectedChat, setSelectedChat } = ChatState()

	const sendMessage = async (e) => {
		if (e.key === "Enter" && newmessage !== "") {
			try {
				const config = {
					headers: {
						'Content-Type': 'application/json',
						'Authorization': `Bearer ${user.token}`
					}
				}

				const { data } = await axios.post('/api/message', {
					content: newmessage,
					chatId: selectedChat._id,
				},
					config
				)
				setNewmessage('')
				setMessages([...messages, data])
				console.log(data)
			}
			catch (e) {
				toast({
					title: "Failed to send message",
					description: "Please try again",
					status: "error",
					duration: 3000,
					isClosable: true,
				})
			}
		}
	}

	const fetchMessages = async () => {
		if (!selectedChat) return

		try {
			const config = {
				headers: {
					Authorization: `Bearer ${user.token}`
				},
			}
			setLoading(true)

			const { data } = await axios.get(`/api/message/${selectedChat._id}`, config)
			console.log(data)
			setMessages(data)
			setLoading(false)
		}
		catch (e) {
			toast({
				title: "Failed to fetch messages",
				description: "Please try again",
				status: "error",
				duration: 3000,
				isClosable: true,
			})
		}
	}

	const typingHandler = (e) => {
		setNewmessage(e.target.value)
		// Typing Indicator Logic
	}

	useEffect(() => {
		fetchMessages();
	}, [selectedChat])

	return (
		<>
			{
				selectedChat ? (
					<>
						<Text fontSize={{ base: "28px", md: "30px" }}
							pb={3} fontFamily="Work sans"
							px={2}
							w="100%"
							display={'flex'}
							justifyContent={{ base: "space-between" }}
							alignItems={'center'}
						>
							<IconButton
								display={{ base: "flex", md: "none" }}
								icon={<ArrowBackIcon />}
								onClick={() => setSelectedChat("")} />

							{!selectedChat.isGroupChat ? (
								<>
									{getSender(user, selectedChat.users)}
									<ProfileModal user={getSenderFull(user, selectedChat.users)} />
								</>
							) : (
								<>
									{selectedChat.chatName.toUpperCase()}
									<UpdateGroupChatModal
										fetchAgain={fetchAgain}
										setFetchAgain={setFetchAgain}
										fetchMessages={fetchMessages}
									/>
								</>
							)}

						</Text>
						<Box
							display={'flex'}
							flexDir={'column'}
							justifyContent={'flex-end'}
							p={3}
							w="100%"
							bg={'#E8E8E8'}
							h="100%"
							borderRadius={"lg"}
							overflowY={'hidden'}
						>
							{loading ? (<Spinner w={20} h={20} alignSelf={'center'} margin={'auto'} />) :
								(
									<div className="messages">
										<ScrollableChat messages={messages} />
									</div>
								)
							}
							<FormControl
								onKeyDown={sendMessage}
								id="first-name"
								isRequired
								mt={3}
							>
								{/* {istyping ? (
									<div>
										<Lottie
											options={defaultOptions}
											// height={50}
											width={70}
											style={{ marginBottom: 15, marginLeft: 0 }}
										/>
									</div>
								) : (
									<></>
								)} */}
								<Input
									variant="filled"
									bg="#E0E0E0"
									placeholder="Enter a message.."
									value={newmessage}
									onChange={typingHandler}
								/>
							</FormControl>
						</Box>
					</>
				) : (
					<Box display={'flex'} alignItems={'center'} justifyContent={'center'} h={100}  >
						<Text fontSize='3xl' pb={3} fontFamily="Work sans" >Select a chat</Text>
					</Box>
				)
			}
		</>
	)
}
