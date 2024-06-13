import React, { useEffect, useState } from 'react';
import { Box, Text, useInput } from 'ink';
import { nanoid } from 'nanoid';
import { createClient } from '@supabase/supabase-js';
import { Alert } from '@inkjs/ui';

type Props = {
	room: string;
	nickname: string;
	supaBaseUrl: string;
	supaBaseKey: string;
};

type Message = { user: string; content: string; id: string; timestamp: string };

export default function App({ room, nickname, supaBaseKey, supaBaseUrl }: Props) {
	const supabase = createClient(supaBaseUrl, supaBaseKey);
	const channel = supabase.channel(room);

	const [userInput, setUserInput] = useState('');
	const [messageToSend, setMessageToSend] = useState('');
	const [isSending, setIsSending] = useState(false);
	const [messages, setMessages] = useState<Array<Message>>([
		{
			user: 'System',
			content: `Welcome to ${room}`,
			id: 'the-room',
			timestamp: new Date().toLocaleTimeString(),
		},
	]);
	// const [users, setUsers] = useState<Array<string>>([nickname]);

	useInput((input, key) => {
		if (key.return) {
			if (userInput.trim() === '\\quit') {
				process.exit();
			} else if (userInput.trim() === '\\help') {
				setMessages(curr => [...curr, {
					user: 'System',
					content: 'Commands: \\quit, \\help',
					id: nanoid(),
					timestamp: new Date().toLocaleTimeString(),
				}]);
			} else {
				setMessageToSend(userInput);
				setUserInput('');
			}
		} else if (key.backspace || key.delete) {
			setUserInput(curr => curr.slice(0, -1));
		} else {
			setUserInput(curr => curr + input);
		}
	});

	useEffect(() => {
		if (!isSending && messageToSend.trim().length > 0) {
			setIsSending(true);
			channel
				.send({
					type: 'broadcast',
					event: 'test-my-messages',
					payload: {
						user: nickname,
						content: messageToSend,
						id: nanoid(),
						timestamp: new Date().toLocaleTimeString(),
					},
				})
				.then(() => {
					setMessageToSend('');
					setIsSending(false);
				});
		}
	}, [messageToSend, isSending, channel]);

	useEffect(() => {
		const subscription = channel
			.on('broadcast', { event: 'test-my-messages' }, ({ payload }) => {
				setMessages(curr => {
					const newMessages = Array.from(
						new Set([...curr, payload as Message]),
					);
					return newMessages;
				});
			})
			.subscribe();

		return () => {
			subscription.unsubscribe().then(() => { });
		};
	}, []);

	// useEffect(() => {
	// 	const presenceSubscription = channel
	// 		.on('broadcast',  { event: 'test-my-messages' }, ({payload }) => {
	// 			// if (event === 'join') {
	// 				setUsers(curr => [...new Set([...curr, payload.username])]);
	// 				setMessages(curr => [...curr, {
	// 					user: 'System',
	// 					content: `${payload.username} joined the chat.`,
	// 					id: nanoid(),
	// 					timestamp: new Date().toLocaleTimeString(),
	// 				}]);
	// 			// } else if (event === 'leave') {
	// 			// 	setUsers(curr => curr.filter(user => user !== payload.username));
	// 			// 	setMessages(curr => [...curr, {
	// 			// 		user: 'System',
	// 			// 		content: `${payload.username} left the chat.`,
	// 			// 		id: nanoid(),
	// 			// 		timestamp: new Date().toLocaleTimeString(),
	// 			// 	}]);
	// 			// }
	// 		})
	// 		.subscribe();

	// 	return () => {
	// 		presenceSubscription.unsubscribe().then(() => { });
	// 	};
	// }, []);

	return (
		<Box flexDirection="column" padding={1} >
			<Box marginBottom={1} justifyContent="space-between">
				<Text color="cyan">Room: {room}</Text>
				<Text color="yellow">User: {nickname}</Text>
			</Box>
			<Box flexDirection="column" borderStyle="round" padding={1}>
				{messages.map(m => (
					<Box key={m.id}>
						<Text
						  color={m.user === nickname ? 'green' : 'white'} >
							{m.user === nickname ? 'You' : m.user} [{m.timestamp}]:
						</Text>
						<Text> {m.content}</Text>
					</Box>
				))}
			</Box>
			{/* <Box  margin={2} borderStyle="round" borderColor={'green'}>
				<Text>{userInput}</Text>
			</Box> */}
			<Box marginTop={1}>
			<Alert variant='success'>
				<Text>{userInput}</Text>
				</Alert>
			</Box>
			<Box marginTop={1} flexDirection="column">
				<Text color="gray">Type a message and press Enter to send. Type \quit to exit.</Text>
				{/* <Text color="cyan">Users online: {users.join(', ')}</Text> */}
			</Box>
		</Box>
	);
}
