import React from 'react';
import { observer } from 'mobx-react';
import { observable } from 'mobx';

interface FileDropZoneProps extends React.HTMLProps<HTMLDivElement> {
  DropZoneUI: React.ComponentType;
  onFilesDropped: (files: File[]) => void;
}

@observer
export class FileDropZone extends React.Component<FileDropZoneProps> {
  @observable
  isInDropZone = false;

  onDragEnter = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    this.props.onDragEnter && this.props.onDragEnter(event);
  };

  onDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    this.isInDropZone = false;
    this.props.onDragLeave && this.props.onDragLeave(event);
  };

  onDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    event.dataTransfer.dropEffect = 'copy';
    this.isInDropZone = true;
    this.props.onDragOver && this.props.onDragOver(event);
  };

  onDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    const files = [...event.dataTransfer.files];
    if (files && files.length > 0) {
      this.props.onFilesDropped(files);
      this.isInDropZone = false;
    }
    this.props.onDrop && this.props.onDrop(event);
  };

  render() {
    const { children, DropZoneUI, onFilesDropped, ...otherProps } = this.props;
    return (
      <div
        {...otherProps}
        onDrop={this.onDrop}
        onDragOver={this.onDragOver}
        onDragEnter={this.onDragEnter}
        onDragLeave={this.onDragLeave}
      >
        {this.isInDropZone ? <DropZoneUI /> : children}
      </div>
    );
  }
}
