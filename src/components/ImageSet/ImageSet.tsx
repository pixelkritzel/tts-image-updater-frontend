import React from 'react';
import { observable, reaction } from 'mobx';
import { observer } from 'mobx-react';
import { RouteComponentProps } from 'react-router-dom';
import { Button, styled } from '@material-ui/core';

import { StoreContext } from 'components/StoreContext';

import { IimageSet } from 'store/imageSetModel';
import { ResponsiveImage } from 'components/ResponsiveImage';
import { FileDropZone } from 'components/FileDropZone';
import { DropZoneUi } from 'components/DropZoneUi';

interface ImageSetProps extends RouteComponentProps<{ imageSetId: string }> {}

const Container = styled('div')({
  display: 'grid',
  gridTemplateColumns: '80% 1fr',
  columnGap: '24px',
  height: '100vh',
  overflow: 'hidden',
});

const Main = styled('div')({
  placeSelf: 'stretch',
});

const SideBar = styled('div')({
  alignSelf: 'stretch',
  overflowY: 'scroll',
});

const StyledFileDropZone = styled(FileDropZone)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100%',
});

@observer
export class ImageSet extends React.Component<ImageSetProps> {
  static contextType = StoreContext;
  context!: React.ContextType<typeof StoreContext>;

  @observable
  imageSet?: IimageSet;

  loadImageSet = () => {
    this.imageSet = this.context.user?.imageSets.get(this.props.match.params.imageSetId);
  };

  componentDidMount() {
    if (!this.context.user) {
      reaction(() => this.context.user, this.loadImageSet);
    } else {
      this.loadImageSet();
    }
  }

  onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = event.target;
    if (files) {
      const image = files[0];
      const formData = new FormData();
      formData.append('image', image, image.name);
      this.imageSet?.addImages(formData);
    }
  };

  onFilesDropped = (files: File[]) => {
    const data = new FormData();
    for (const file of files) {
      data.append('images', file);
    }
    this.imageSet?.addImages(data);
  };

  render() {
    if (!this.imageSet) return null;

    return (
      <Container>
        <Main>
          {/* <Input type="file" onChange={this.onFileChange} /> */}
          <StyledFileDropZone DropZoneUI={DropZoneUi} onFilesDropped={this.onFilesDropped}>
            <ResponsiveImage src={this.imageSet.selectedImage.url} />
          </StyledFileDropZone>
        </Main>
        <SideBar>
          {this.imageSet.imagesAsArray.map((image) => (
            <Button key={image.id} onClick={() => this.imageSet?.setSelectedImage(image)}>
              <ResponsiveImage src={image.url} />
            </Button>
          ))}
        </SideBar>
      </Container>
    );
  }
}
