import React, { useEffect } from 'react';
import logo from './logo.svg';
import './App.css';

import {
  Box,
  Button,
  Grommet,
  Text,
  TextInput,
  ResponsiveContext,
  Tab,
  Tabs,
  Grid,
  Heading,
  Tag,
  Anchor,
  Image,
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "grommet";

import { AppHeader } from './components/AppHeader/AppHeader';
import { Search, Menu, Send, LinkBottom, LinkDown, LinkUp, Gremlin as GremlinIcon, LinkPrevious } from "grommet-icons";
import { Routes, Route, useParams, useNavigate, Navigate, useLocation } from "react-router-dom";
import { theme } from "./theme"
import useAppState from './hooks/useApp';
import useUser from './hooks/useUser';
import { ethers } from 'ethers';
import { RoutedAnchor } from './components/RoutedAnchor/RoutedAnchor';
import hoprLogo from './hopr_icon.svg';
import { RoutedButton } from "./components/RoutedButton/RoutedButton";
import { PeerAddress } from './components/PeerAddress/PeerAddress';
import Chat from './components/Chat/Chat';
import useWebsocket from './hooks/useWebsocket';
import Settings from './components/Settings/Settings';
import styled from 'styled-components';


const BottomShadowBox = styled(Box)`
box-shadow: 0 3px 2px -2px gray;
`

const GoBack = styled(LinkPrevious)`
cursor: pointer;
`

export const List = (props: any) => <Box {...props} />;

// routed button n we done
export const ListItem = ({ path, ...props }: any) => (
  <RoutedButton path={path} hoverIndicator="light-4">
    <Box
      border="bottom"
      pad={{ horizontal: "small", vertical: "medium" }}
      direction="row-responsive"
      align="center"
      {...props}
    />
  </RoutedButton>
);

function SettingsBody({ updateSettings, settings, ...props }: any) {
  const navigate = useNavigate();

  return <Box fill background="light-3">
    <Box flex overflow="auto" gap="medium" pad="medium">
      <Box flex={false} direction="row-responsive" wrap>
        <Box gap="large" flex="grow" margin="medium">
        </Box>
        <Box gap="large" flex="grow" margin="medium">
          <Box round pad="medium" direction="column" background="white">
            <Box direction="row">
              <GoBack onClick={() => navigate(-1)} />
              <Box margin={{ left: "small" }}>
                <Text>Settings</Text>
              </Box>
            </Box>
            <Settings settings={settings} updateSettings={updateSettings} />
          </Box>

          {/* {utilization.map(data => (
      <UtilizationCard key={data.name} data={data} />
    ))} */}
          <Box flex="grow" margin="medium" align="center">
            <Text>made with <Anchor target="_blank" href="https://v2.grommet.io/"><GremlinIcon color="brand" /> Grommet</Anchor> and <Anchor target="_blank" href="https://hoprnet.org/"><img width="24" src={hoprLogo} /> Hopr</Anchor></Text>
          </Box>
        </Box>
        <Box flex="grow" margin="medium">
        </Box>
      </Box>
    </Box>
  </Box>
}

function ChatBody({ myPeerId, handleAddNewConversation, selection, setSelection, conversations, sendMessage }: any) {
  // msg history
  const navigate = useNavigate();
  const params = useParams();

  const conversation = selection ? conversations.get(selection) : undefined;

  // useEffect(() => {
  //   setSelection(params.id)
  // }, [])

  return <Box fill background="light-3">
    <Box flex overflow="auto" gap="medium" pad="medium">
      <Box flex={false} direction="row-responsive" wrap>
        <Box gap="large" flex="grow" margin="medium">
        </Box>
        <Box gap="large" flex="grow" margin="medium">
          <Box round pad="medium" direction="column" background="white">
            <Box direction="row">
              <GoBack onClick={() => navigate(-1)} />
              <PeerAddress margin={{ left: "small" }} style={{ textDecoration: "underline dotted" }} expandable={true} address={params.id} />
            </Box>
            <Chat
              myPeerId={myPeerId}
              peerId={params.id}
              handleAddNewConversation={handleAddNewConversation}
              conversation={conversation ? Array.from(conversation.values()) : []}
              sendMessage={sendMessage}
              selection={selection}
            // setSelection={setSelection}
            />
          </Box>

          {/* {utilization.map(data => (
        <UtilizationCard key={data.name} data={data} />
      ))} */}
          <Box flex="grow" margin="medium" align="center">
            <Text>made with <Anchor target="_blank" href="https://v2.grommet.io/"><GremlinIcon color="brand" /> Grommet</Anchor> and <Anchor target="_blank" href="https://hoprnet.org/"><img width="24" src={hoprLogo} /> Hopr</Anchor></Text>
          </Box>
        </Box>
        <Box flex="grow" margin="medium">
        </Box>
      </Box>
    </Box>
  </Box>
}

function ChannelPanel({ channelsBoth, closeChannel }: any) {
  const navigate = useNavigate();
  const params = useParams();

  const channel = channelsBoth.find(({ channelId }: any) => channelId === params.id)

  return (channel ? <Box>
    <Box flex="grow">
      <Box margin={{ horizontal: "medium" }}>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell scope="row">
                <strong>Type</strong>
              </TableCell>
              <TableCell>{channel.type}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell scope="row">
                <strong>Channel Id</strong>
              </TableCell>
              <TableCell>{channel.channelId}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell scope="row">
                <strong>Peer Id</strong>
              </TableCell>
              <TableCell>{channel.peerId}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell scope="row">
                <strong>Status</strong>
              </TableCell>
              <TableCell>{channel.status}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell scope="row">
                <strong>Balance</strong>
              </TableCell>
              <TableCell>{ethers.utils.formatEther(channel.balance)} HOPR</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Box>
    </Box>
    <Box align="end" flex="grow" margin={{ horizontal: "medium" }} direction="row">
      <Box flex="grow" margin="small">
        <Button onClick={() => navigate(-1)} secondary label="back"></Button>
      </Box>
      <Box flex="grow" margin="small">
        <Button onClick={() => { closeChannel(channel.peerId, channel.type); navigate(-1) }} primary label="close"></Button>
      </Box>
    </Box>
  </Box> : <Text>Fetching channels...</Text>)
}

function HomePanel({ peers, channelsBoth }: any) {
  return <Tabs alignControls="start" flex="grow">
    <Tab title='Peers'>
      <Box>
        <List>
          {
            peers.map(({ id }: any, i: number) => {
              return <ListItem path={`/peer/${id}`} key={i}>
                <Box flex="grow">
                  <PeerAddress style={{ textDecoration: "underline dotted" }} address={id} />
                </Box>
              </ListItem>
            })
          }
        </List>
      </Box>
    </Tab>
    <Tab title='Channels'>
      <Box>
        {channelsBoth && <List>
          {
            channelsBoth.map(({ type, channelId, peerId, status, balance }: any) => {
              return (
                <ListItem key={channelId} path={`/app/channel/${channelId}`}>
                  <Box margin={{ horizontal: "small" }} flex="grow">
                    <Box direction="row">
                      <PeerAddress address={channelId} />
                    </Box>
                    <PeerAddress style={{ textDecoration: "underline dotted" }} size="xsmall" address={peerId} />
                  </Box>
                  <Box>
                    <Tag size="xsmall" name="status" value={status} />
                  </Box>
                  <Box flex="grow" align="end">
                    {type === 'incoming' ? <LinkDown></LinkDown> : <LinkUp></LinkUp>}
                  </Box>
                </ListItem>
              )
            })
          }
        </List>}
      </Box>
    </Tab>
  </Tabs>

}

function AppBody({ myPeerId, native, balances, channelsBoth, peers, closeChannel }: any) {
  return (
    <Box fill background="light-3">
      <Box flex overflow="auto" gap="medium" pad="medium">
        <Box flex={false} direction="row-responsive" wrap>
          <Box gap="large" flex="grow" margin="medium">
          </Box>
          <Box gap="large" flex="grow" margin="medium">
            <AppHeader
              appName={myPeerId || ""}
              appIcon={<Menu />}
              nativeAddress={native || ""}
            />
            <Box round pad="medium" direction="column" background="white">
              <Box round flex="grow">
                <Box round flex="grow">
                  <Box width="100%" margin={{ horizontal: "auto" }} align="center">
                    <Text>
                      Account
                    </Text>
                    <Box pad={{ bottom: "small" }} width="100%" border="bottom" flex="grow" align="center">
                      <Text size="xsmall">
                        <PeerAddress style={{ textDecoration: "underline dotted" }} address={myPeerId || ""} expandable={true} />
                      </Text>
                    </Box>
                    <Box margin="small" align="center">
                      <Text weight="bolder" size="xlarge">{ethers.utils.formatEther(balances.hopr || '0')} HOPR</Text>
                      <Text>{ethers.utils.formatEther(balances.eth || '0')} ETH</Text>
                    </Box>
                    <BottomShadowBox width="100%" justify="center" margin="small" direction="row">
                      <Anchor target="_blank" href="https://app.uniswap.org/#/swap?outputCurrency=0xf5581dfefd8fb0e4aec526be659cfab1f8c781da&chain=mainnet">
                        <Box margin={{ horizontal: "xsmall" }} align="center">
                          <Box round background="brand" pad="xsmall">
                            <LinkBottom size="medium" />
                          </Box>
                          <Text>Buy</Text>
                        </Box>
                      </Anchor>
                      {/* <RoutedAnchor href="/message/0xfoo">
                        <Box margin={{ horizontal: "xsmall" }} align="center">
                          <Box round background="brand" pad="xsmall">
                            <Send size="medium" />
                          </Box>
                          <Text>Message</Text>
                        </Box>
                      </RoutedAnchor> */}
                    </BottomShadowBox>
                  </Box>
                </Box>
                <Routes>
                  <Route index element={<HomePanel channelsBoth={channelsBoth} peers={peers} />} />
                  <Route path="channel/:id" element={<ChannelPanel closeChannel={closeChannel} channelsBoth={channelsBoth} />} />
                </Routes>
                {/* <Box margin={{ top: "small" }} round height="xsmall" flex="grow" background="light-5"></Box> */}
              </Box>
            </Box>

            {/* {utilization.map(data => (
            <UtilizationCard key={data.name} data={data} />
          ))} */}
            <Box flex="grow" margin="medium" align="center">
              <Text>made with <Anchor target="_blank" href="https://v2.grommet.io/"><GremlinIcon color="brand" /> Grommet</Anchor> and <Anchor target="_blank" href="https://hoprnet.org/"><img width="24" src={hoprLogo} /> Hopr</Anchor></Text>
            </Box>
          </Box>
          <Box flex="grow" margin="medium">
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

function App() {
  const {
    state: { settings, conversations, selection },
    updateSettings,
    setSelection,
    addSentMessage,
    addReceivedMessage,
    handleAddNewConversation,
    handleSendMessage,
    handleReceivedMessage
  } = useAppState()
  
  const { search } = useLocation();

  const websocket = useWebsocket(settings)
  const { socketRef } = websocket
  const user = useUser(settings)
  const { myPeerId, balances, channels, native } = user?.state;

  const { closeChannel, getReqHeaders } = user

  const channelsBoth = channels.incoming ? channels.incoming.concat(channels.outgoing || []) : []

  const peers: any[] = (() => {
    const allPeers = [...((channelsBoth || []).map(({ peerId }: any) => ({ id: peerId })))]

    return allPeers.filter(({ id }, i) => i !== allPeers.findIndex(({ id: peerId }) => id === peerId))
  })()

  useEffect(() => {
    if (!myPeerId || !socketRef.current) return;
    socketRef.current.addEventListener(
      "message",
      handleReceivedMessage(addReceivedMessage)
    );

    return () => {
      if (!socketRef.current) return;
      socketRef.current.removeEventListener(
        "message",
        handleReceivedMessage(addReceivedMessage)
      );
    };
  }, [myPeerId, socketRef.current]);

  return (
    <Grommet theme={theme} full>
      <Routes>
        <Route path="/" element={<Navigate to={`/app${search}`} replace />}>
        </Route>
        <Route path="app/*" element={<AppBody
          myPeerId={myPeerId}
          native={native}
          balances={balances}
          channelsBoth={channelsBoth}
          peers={peers}
          closeChannel={closeChannel}
        />} />
        <Route path="peer/:id" element={<ChatBody
          myPeerId={myPeerId}
          conversations={conversations}
          sendMessage={handleSendMessage(addSentMessage)(
            myPeerId,
            socketRef,
            getReqHeaders(true)
          )}
          selection={selection}
          setSelection={setSelection}
          handleAddNewConversation={handleAddNewConversation}
        />} />
        <Route path="settings" element={<SettingsBody settings={settings} updateSettings={updateSettings} />} />
      </Routes>
    </Grommet>
  );
}

export default App;
