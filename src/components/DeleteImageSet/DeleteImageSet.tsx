import React from 'react';
import { observer } from 'mobx-react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@material-ui/core';

import { IimageSet } from 'store/imageSetModel';
import { StoreContext } from 'components/StoreContext';
import { observable } from 'mobx';
import { RouteComponentProps, withRouter } from 'react-router-dom';

interface DeleteImageSetProps extends RouteComponentProps {
  imageSet: IimageSet;
}

const DeleteDialog: React.FC<{ id: number; onCancel: () => void; onDelete: () => void }> = ({
  id,
  onCancel,
  onDelete,
}) => (
  <Dialog
    open={true}
    aria-labelledby={`dialog-title-${id}`}
    aria-describedby={`dialog-description-${id}`}
  >
    <DialogTitle id={`dialog-title-${id}`}>{'Deleting image set?'}</DialogTitle>
    <DialogContent>
      <DialogContentText id={`dialog-description-${id}`}>
        Are you yure you want to delete this image set?
      </DialogContentText>
    </DialogContent>
    <DialogActions>
      <Button onClick={onCancel} color="primary">
        Cancel
      </Button>
      <Button onClick={onDelete} color="secondary" autoFocus>
        Continue
      </Button>
    </DialogActions>
  </Dialog>
);

@observer
class DeleteImageSetComponent extends React.Component<DeleteImageSetProps> {
  static contextType = StoreContext;
  context!: React.ContextType<typeof StoreContext>;

  @observable
  isDeleteShown = false;

  onDelete = async () => {
    this.isDeleteShown = false;
    this.props.history.replace('/');
    await this.context.user!.deleteImageSet(this.props.imageSet.id);
  };

  render() {
    const { imageSet } = this.props;

    return (
      <>
        <Button variant="text" color="secondary" onClick={() => (this.isDeleteShown = true)}>
          Delete image set!
        </Button>
        {this.isDeleteShown && (
          <DeleteDialog
            id={imageSet.id}
            onCancel={() => (this.isDeleteShown = false)}
            onDelete={this.onDelete}
          />
        )}
      </>
    );
  }
}

export const DeleteImageSet = withRouter(DeleteImageSetComponent);
