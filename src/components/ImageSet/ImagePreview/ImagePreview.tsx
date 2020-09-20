import React from 'react';
import { observer } from 'mobx-react';

import { ResponsiveImage } from 'components/ResponsiveImage';

import { Iimage } from 'store/imageSetModel';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  styled,
} from '@material-ui/core';
import { Delete, Edit } from '@material-ui/icons';
import { observable } from 'mobx';

interface ImagePreviewProps extends React.HTMLAttributes<HTMLDivElement> {
  image: Iimage;
  setSelectedImage: (image: Iimage) => void;
}

const ImagePreviewContainer = styled('div')({
  display: 'flex',
});

const Toolbar = styled('div')({
  display: 'flex',
  flexDirection: 'column',
});

const Name = styled('div')({
  textAlign: 'center',
});

const StyledButton = styled(Button)({
  position: 'relative',
  fontSize: 0,
});

const DeleteDialog: React.FC<{ id: string; onCancel: () => void; onDelete: () => void }> = ({
  id,
  onCancel,
  onDelete,
}) => (
  <Dialog
    open={true}
    aria-labelledby={`dialog-title-${id}`}
    aria-describedby={`dialog-description-${id}`}
  >
    <DialogTitle id={`dialog-title-${id}`}>{'Deleting image?'}</DialogTitle>
    <DialogContent>
      <DialogContentText id={`dialog-description-${id}`}>
        Are you yure you want to delete this image?
      </DialogContentText>
    </DialogContent>
    <DialogActions>
      <Button onClick={onCancel} color="primary">
        Cancel
      </Button>
      <Button onClick={onDelete} color="primary" autoFocus>
        Continue
      </Button>
    </DialogActions>
  </Dialog>
);

@observer
export class ImagePreview extends React.Component<ImagePreviewProps> {
  @observable
  isDeleteDialogShown = false;

  @observable
  deleteImage = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    this.isDeleteDialogShown = true;
  };

  render() {
    const { image, setSelectedImage, ...otherProps } = this.props;
    return (
      <div {...otherProps}>
        <ImagePreviewContainer>
          <StyledButton
            key={image.id}
            onClick={() => {
              setSelectedImage(image);
            }}
          >
            <ResponsiveImage src={image.url} />
          </StyledButton>

          <Toolbar>
            {/* <IconButton aria-label="Edit image">
              <Edit />
            </IconButton> */}
            {!image.isSelected && (
              <IconButton aria-label="Delete image" onClick={this.deleteImage}>
                <Delete />
              </IconButton>
            )}
          </Toolbar>
        </ImagePreviewContainer>
        {image.name && <Name>Morle</Name>}
        {this.isDeleteDialogShown && (
          <DeleteDialog
            id={image.id}
            onCancel={() => (this.isDeleteDialogShown = false)}
            onDelete={() => {
              image.delete();
              this.isDeleteDialogShown = false;
            }}
          />
        )}
      </div>
    );
  }
}
