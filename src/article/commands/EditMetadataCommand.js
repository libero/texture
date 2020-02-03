import { Command } from 'substance';

export default class EditMetadataCommand extends Command {
  getCommandState() {
    return { disabled: false };
  }

  execute(params, context) {
    context.editorSession.getRootComponent().send('startWorkflow', 'edit-metadata-workflow');
  }
}
