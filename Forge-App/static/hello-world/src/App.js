import React, { useEffect, useState, useCallback } from 'react';
import { invoke, requestJira} from '@forge/bridge';
import Button from '@atlaskit/button';
import { SpotlightCard } from '@atlaskit/onboarding';
import Avatar from '@atlaskit/avatar';
import Textfield from '@atlaskit/textfield';
import Modal, {
    ModalBody,
    ModalFooter,
    ModalHeader,
    ModalTitle,
    ModalTransition,
  } from '@atlaskit/modal-dialog';

function App() {
    const [data, setData] = useState(null);

    useEffect(() => {
        invoke('getText', { example: 'my-invoke-variable' }).then(setData);
    }, []);

    const getCurrentUserId = async (expand) => {
        const jiraUser = await requestJira('/rest/api/3/myself')
          .then((res) => res.json())
          .then((res) => res)
          .catch((error) => error)
        return await jiraUser
    }
    
    const getOneProject = async (projKey) => {
        const jiraUser = await requestJira(`/rest/api/3/project/${projKey}`)
          .then((res) => res.json())
          .then((res) => res)
          .catch((error) => error)
        return await jiraUser
    }

    const [isOpen, setIsOpen] = useState(false);
    const openModal = useCallback(() => setIsOpen(true), []);
    const closeModal = useCallback(() => setIsOpen(false), []);

    return (
        <div style={{display: 'flex', justifyContent: 'space-around'}}>
            <div style={{width: "400px"}}>

                <SpotlightCard>
                    <Avatar
                    appearance="circle"
                    src="https://secure.gravatar.com/avatar/8d515363bfdc0c71c58a1281209a2990?d=https%3A%2F%2Favatar-management--avatars.us-west-2.prod.public.atl-paas.net%2Fdefault-avatar-1.png"
                    size="xlarge"
                    name="userAvatar"
                    />
                    <p>Your id: <span id='userId'></span></p>
                    <p>Your name: <span id='userName'></span></p>
                    <p>Your email: <span id='userEmail'></span></p>
                    <p>Your time zone: <span id='userZone'></span></p>
                </SpotlightCard>
                <Button appearance="primary" onClick={async () => {
                    let user = await getCurrentUserId()
                    let {accountId, displayName, emailAddress, timeZone, avatarUrls} = user
                    document.getElementById("userId").textContent = accountId
                    document.getElementById("userName").textContent = displayName
                    document.getElementById("userEmail").textContent = emailAddress
                    document.getElementById("userZone").textContent = timeZone
                    console.log(user)
                    console.log(document.querySelector('Avatar'))
                }}>Press to get user info</Button>
            </div>
            <div style={{width: "400px"}}>
                <SpotlightCard>
                    <h1 style={{color: 'white'}}>Project information</h1>
                    <p>Project id: <span id='projId'></span></p>
                    <p>Project name: <span id='projName'></span></p>
                    <p>Project key: <span id='projKey'></span></p>
                    <p>Project leader: <span id='projLead'></span></p>
                    <p>Project type: <span id='projType'></span></p>
                </SpotlightCard>
                <Textfield name="basic" aria-label="default text field" placeholder='Enter project key...'/>
                <Button appearance="primary" onClick={async () => {
                    openModal()
                    let proj = await getOneProject(document.querySelector('Input').value)
                    console.log(document.querySelector('Input').value)
                    console.log(proj)
                    if (document.querySelector('Input').value == '') {
                        console.log('no value')
                    }
                    else if (proj.hasOwnProperty('errorMessages') == true) {
                        console.log('error')
                    }
                    else{
                        let {id, name, key, lead, projectTypeKey} = proj
                        
                        document.getElementById('projId').textContent = id
                        document.getElementById('projName').textContent = name
                        document.getElementById('projKey').textContent = key
                        document.getElementById('projLead').textContent = lead.displayName
                        document.getElementById('projType').textContent = projectTypeKey
                    }
                }}>Press to get project info</Button>
            </div>
        <ModalTransition>
            {isOpen && (
                <Modal onClose={closeModal}>
                    <ModalHeader>
                        <ModalTitle>Project key not found</ModalTitle>
                    </ModalHeader>
                    <ModalBody>
                        If you want to create a new project <a>press here</a>
                    </ModalBody>
                    <ModalFooter>
                        <Button appearance="subtle" onClick={closeModal}>
                            Cancel
                        </Button>
                    </ModalFooter>
                </Modal>
            )}
        </ModalTransition>
    </div>
    )
}

export default App;
