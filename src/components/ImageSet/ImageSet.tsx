import React from 'react';
import { observable, reaction } from 'mobx';
import { Observer, observer } from 'mobx-react';
import { RouteComponentProps } from 'react-router-dom';
import { styled } from '@material-ui/core';

import { StoreContext } from 'components/StoreContext';

import { IimageSet } from 'store/imageSetModel';
import { ResponsiveImage } from 'components/ResponsiveImage';
import { FileDropZone } from 'components/FileDropZone';
import { DropZoneUi } from 'components/DropZoneUi';
import { ImagePreview } from './ImagePreview';
import { DeleteImageSet } from 'components/DeleteImageSet';

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
  '& > *': {
    position: 'relative',
    paddingBottom: '12px',

    '&:after': {
      content: '""',
      position: 'absolute',
      left: '5%',
      bottom: '6px',
      width: '90%',
      height: '1px',
      backgroundColor: 'lightgrey',
    },
  },
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

  DropZone: React.FC = ({ children }) => (
    <StyledFileDropZone DropZoneUI={DropZoneUi} onFilesDropped={this.onFilesDropped}>
      {children}
    </StyledFileDropZone>
  );

  render() {
    const { DropZone, imageSet } = this;
    if (!imageSet) return null;

    return (
      <Container>
        {imageSet.imagesAsArray.length ? (
          <>
            <Observer>
              {() => (
                <Main>
                  {/* <Input type="file" onChange={this.onFileChange} /> */}
                  <DropZone>
                    <ResponsiveImage src={this.imageSet!.selectedImage?.url} />
                  </DropZone>
                </Main>
              )}
            </Observer>
            <Observer>
              {() => (
                <SideBar>
                  {this.imageSet!.imagesAsArray.map((image) => (
                    <ImagePreview
                      key={image.id}
                      image={image}
                      setSelectedImage={this.imageSet!.setSelectedImage}
                    />
                  ))}
                  <DeleteImageSet imageSet={imageSet} />
                </SideBar>
              )}
            </Observer>
          </>
        ) : (
          <DropZone>
            <div>It appears your image set is empty just drop your images here!</div>
          </DropZone>
        )}
      </Container>
    );
  }
}
