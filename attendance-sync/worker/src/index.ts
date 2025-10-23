import { container, initiateContainer, listen } from '@orchesty/nodejs-sdk';
import { CreateWorklog } from './Jira/Connector/CreateWorklog';
import { TogglToJiraMapper } from './Jira/CustomNode/TogglToJiraMapper';
import { JiraApplication } from './Jira/JiraApplication';
import { GetTimeEntries } from './Toggl/Batch/GetTimeEntries';
import { TogglApplication } from './Toggl/TogglApplication';

function prepare(): void {
    // Load core services by:
    initiateContainer();

    const jiraApp = new JiraApplication();
    container.setApplication(jiraApp);

    const togglApp = new TogglApplication();
    container.setApplication(togglApp);

    const jiraWorklogConnector = new CreateWorklog();
    container.setNode(jiraWorklogConnector, jiraApp);

    const mapper = new TogglToJiraMapper();
    container.setNode(mapper);

    const togglGetTimeEntries = new GetTimeEntries();
    container.setNode(togglGetTimeEntries, togglApp);
}

// Start App by:
prepare();
listen();
