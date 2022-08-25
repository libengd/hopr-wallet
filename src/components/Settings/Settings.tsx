import { Box, TextInput, Button } from "grommet"
import { Key, Server } from "grommet-icons"
import { useState } from "react"
import styled from "styled-components"


export const Settings = ({ updateSettings, settings, ...props }: any) => {
  const [apiEndpoint, setApiEndpoint] = useState(settings.apiEndpoint)
  const [apiToken, setApiToken] = useState(settings.apiToken)

  return <Box>
    <Box pad="small">
      <TextInput onChange={(e) => setApiEndpoint(e.target.value)} value={apiEndpoint} placeholder="HOPR Endpoint" icon={<Server />} />
    </Box>
    <Box pad="small">
      <TextInput type="password" onChange={(e) => setApiToken(e.target.value)} value={apiToken} placeholder="API Token" icon={<Key/>} />
    </Box>
    <Box pad="small">
      <Button onClick={() => updateSettings({ apiEndpoint, apiToken })} secondary label="save"></Button>
    </Box>
  </Box>
}

export default Settings;