// App.js
import React, { useState, useEffect } from 'react';
import {
	Box,
	Flex,
	Text,
	Heading,
	List,
	ListItem,
	Divider,
	Collapse,
	Checkbox // ← added
} from '@chakra-ui/react';
import { ChevronDownIcon, ChevronRightIcon } from '@chakra-ui/icons';
//import testcases from './testcases.json';
//import testcases from './testcases_updated.json';
//import testcases from './testcases_4_each.json';
import testcases from './testcases_with_cli_rip_mpls.json';
import keysightLogo from './keysight-logo.svg';

export default function App() {
	const [selectedId, setSelectedId] = useState(null);
	const [selectedTest, setSelectedTest] = useState(null);
	const [openGroups, setOpenGroups] = useState({});
	const [checkedTests, setCheckedTests] = useState({}); // ← added

	useEffect(() => {
		if (selectedId) {
			const match = testcases.find(t => t.id === selectedId);
			setSelectedTest(match || null);
		}
	}, [selectedId]);

	const groupMap = {};
	testcases.forEach(tc => {
		const parts = tc.id.split(".");
		if (parts.length === 4) {
			const groupId = parts[0];
			if (!groupMap[groupId]) groupMap[groupId] = [];
			groupMap[groupId].push(tc);
		}
	});

	const toggleGroup = (gid, group) => {
		setOpenGroups(prev => ({ ...prev, [gid]: !prev[gid] }));
		setSelectedId(group.id);
	};

	const toggleTest = (id) => {
		setCheckedTests(prev => ({
			...prev,
			[id]: !prev[id]
		}));
	};

	return (
		<Box>
			<Flex
				as="header"
				width="100%"
				align="center"
				justify="space-between"
				bg="white"
				color="black"
				padding="10px 20px"
				marginBottom="4"
			>
				<Flex align="center" gap="20px">
					<img src={keysightLogo} alt="Keysight Logo" style={{ height: "60px" }} />
					<button style={{
						backgroundColor: "#007bff",
						color: "white",
						border: "none",
						padding: "8px 16px",
						borderRadius: "4px",
						cursor: "pointer"
					}}>
						Run Tests
					</button>
					<Text fontSize="sm">
						{Object.values(checkedTests).filter(Boolean).length}/{testcases.length - 8} tests selected to run
					</Text>

				</Flex>
				<Box textAlign="right">
					<Text fontWeight="bold">Contact:</Text>
					<a href="mailto:ernest.o.cooper@gmail.com" style={{ textDecoration: "underline", color: "black" }}>
						ernest.o.cooper@gmail.com
					</a>
				</Box>
			</Flex>
			<Flex height="calc(100vh - 64px)" padding="4" bg="#2a2a2a">
				<Box width="20%" bg="#1e1e1e" paddingRight="4" overflowY="auto" color="white">
					<Heading size="md" mb="4">Test Cases</Heading>
					<List spacing={2}>
						{Object.entries(groupMap).map(([gid, items]) => {
							const group = items.find(x => x.id.endsWith('.0'));
							const tests = items.filter(x => !x.id.endsWith('.0'));
							return (
								<Box key={gid} mb={3}>
									<Flex align="center" onClick={() => toggleGroup(gid, group)} cursor="pointer">
										{openGroups[gid] ? <ChevronDownIcon mr={1} /> : <ChevronRightIcon mr={1} />}
										<Text fontWeight="bold">{group ? `${group.id} - ${group.category}` : gid}</Text>
									</Flex>
									<Collapse in={openGroups[gid]}>
										<List pl={4} pt={1}>
											{tests.map(test => (
												<ListItem
													key={test.id}
													cursor="pointer"
													_hover={{ bg: 'gray.100' }}
													onClick={() => setSelectedId(test.id)}
													fontWeight={selectedId === test.id ? 'bold' : 'normal'}
													display="flex"
													justifyContent="space-between"
													alignItems="center"
												>
													<Text>{test.id}</Text>
													{/* Hereitis */}
													<Checkbox
														isChecked={checkedTests[test.id]}
														onChange={() => toggleTest(test.id)}
														iconColor="yellow"
														bg={checkedTests[test.id] ? 'red.500' : 'white'}
														borderColor="black"
														borderWidth="1px"
														p="1"
													/>
												</ListItem>
											))}
										</List>
									</Collapse>
								</Box>
							);
						})}
					</List>
				</Box>
				<Box width="80%" bg="#2e2e2e" paddingLeft="6" color="white">
					{selectedTest ? (
						<>
							<Heading size="lg" mb="2">{selectedTest.name}</Heading>
							<Text><strong>ID:</strong> {selectedTest.id}</Text>
							<Text><strong>Category:</strong> {selectedTest.category}</Text>
							<Text><strong>Description:</strong> {selectedTest.description}</Text>
							<Text><strong>Created:</strong> {selectedTest.created}</Text>
							<Text><strong>Modified:</strong> {selectedTest.modified}</Text>
							<Text><strong>Authors:</strong> {selectedTest.authors?.join(', ')}</Text>
							<Divider my="2" />
							<Text><strong>Runtime:</strong> {selectedTest.runtime}</Text>
							<Text><strong>Last Fail:</strong> {selectedTest.lastFail}</Text>
							<Text><strong>Fail Count:</strong> {selectedTest.failCount}</Text>
							<Text><strong>Run Count:</strong> {selectedTest.runCount}</Text>
							<Text><strong>Last Run Result:</strong> {selectedTest.last_run?.result}</Text>
							<Text><strong>Last Run Date:</strong> {selectedTest.last_run?.date}</Text>
							{selectedTest.code && (
								<Text mt="2"><strong>Code File:</strong> {selectedTest.code}</Text>
							)}
							{selectedTest.steps?.length > 0 && (
								<>
									<Divider my="2" />
									<Heading size="md" mb="1">Steps</Heading>
									<List pl={4} spacing={1}>
										{selectedTest.steps.map((step, idx) => (
											<ListItem key={idx}>• {step}</ListItem>
										))}
									</List>
								</>
							)}
						</>
					) : (
						<Text>Select a test case from the left to view details.</Text>
					)}
				</Box>
			</Flex>
		</Box>
	);
}
