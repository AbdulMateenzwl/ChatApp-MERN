import React from 'react'
import { Box, Text } from '@chakra-ui/layout'
import { ChatState } from '../Context/ChatProvider'
import { IconButton } from '@chakra-ui/button'
import { ArrowBackIcon } from '@chakra-ui/icons'
import { getSender, getSenderFull } from '../config/ChatLogics'
import ProfileModal from './miscellaneous/ProfileModal'

export default function SingleChat({ fetchAgain, setFetchAgain }) {
	const { user, selectedChat, setSelectedChat } = ChatState()

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
									{/* // update group modal */}
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
							{/* Messages Here */}
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
