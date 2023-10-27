<template>
  <div class="flex" v-for="(file, k) in filesPreview" :key="k">
    <div
      class="cursor-pointer"
      @click="selectFile(k)"
      @dragover.prevent="handleDragOver($event, k, 'reset')"
      @dragleave.prevent="handleDragLeave($event, k, 'reset')"
      @drop="handleDrop($event, k, 'reset')"
    >
      <slot :file="file"></slot>
      <input
        ref="fileInput"
        type="file"
        class="hidden"
        :accept="accept"
        @change="uploadDefaultImage($event, k, 'reset')"
      />
    </div>
    <button
      type="button"
      class="remove-btn bg-[#ccc] rounded-full h-7 dark:bg-stone-500 dark:text-white px-2.5"
      @click="removeImg(k)"
    >
      {{ removeBtn }}
    </button>
  </div>

  <div
    @click="selectFiles"
    @dragover.prevent="handleDragOver($event, filesPreview.length, 'add')"
    @dragleave.prevent="handleDragLeave($event, filesPreview.length, 'add')"
    @drop="handleDrop($event, filesPreview.length, 'add')"
  >
    <slot></slot>
    <input
      ref="newfilesInput"
      type="file"
      class="hidden"
      :accept="accept"
      @change="uploadDefaultImage($event, filesPreview.length, 'add')"
      multiple
    />
  </div>

  <div class="upload-btn relative" :class="{ 'progress progress-striped active': isUploading }">
    <button
      type="button"
      class="flex items-center justify-center bg-slate-700 dark:text-slate-300 dark:bg-blue-700 text-white flex-none py-3 px-8 rounded-full bottom-0 absolute disabled:opacity-70 disabled:cursor-not-allowed"
      :class="{ 'progress-bar cursor-wait': isUploading }"
      @click="uploadingFunction"
      :disabled="files.length == 0"
    >
      {{ isUploading ? progressBtn : uploadBtn }}
    </button>
  </div>

  <div class="hidden" v-if="!isUploading ? removePreviewFiles() : ''"></div>
</template>

<script lang="ts">
import placeHolderImage from '../assets/images/placeholder.png'
import pdfPreview from '../assets/images/pdf-icon.png'
import textPreview from '../assets/images/text-icon.png'
import audioPreview from '../assets/images/music-icon.png'
import apkPreview from '../assets/images/apk-icon.png'
import zipPreview from '../assets/images/zip-icon.png'
import sqlPreview from '../assets/images/sql-icon.png'
import filePreview from '../assets/images/file-icon.png'

export default {
  emits: ['files', 'uploading'],
  props: {
    removeBtn: {
      type: String,
      default: 'x'
    },
    uploadBtn: {
      type: String,
      default: 'Upload'
    },
    progressBtn: {
      type: String,
      default: 'Uploading...'
    },
    accept: String,
    isUploading: {
      type: Boolean,
      required: true
    },
    pdfPreview: {
      type: String,
      default: pdfPreview
    },
    textPreview: {
      type: String,
      default: textPreview
    },
    audioPreview: {
      type: String,
      default: audioPreview
    },
    apkPreview: {
      type: String,
      default: apkPreview
    },
    zipPreview: {
      type: String,
      default: zipPreview
    },
    sqlPreview: {
      type: String,
      default: sqlPreview
    },
    filePreview: {
      type: String,
      default: filePreview
    }
  },
  data() {
    return {
      flag: 0,
      isDragging: false,
      isLoading: false,
      errorAlertVisible: false,
      errorMessage: 'Something went wrong',
      settingSavedSuccess: false,
      filesPreview: [] as Array<{
        previewType: string
        previewUrl: string | ArrayBuffer | null
        previewName: string
        isDragging: boolean
        isLoading: boolean
      }>,
      files: [] as any
    }
  },
  methods: {
    removePreviewFiles() {
      if (this.flag == 1) {
        this.filesPreview = []
        this.files = []
        this.flag = 0
      }
    },
    uploadingFunction() {
      if (this.files.length > 0) {
        this.$emit('files', this.files)
        this.$emit('uploading', true)
        this.flag = 1
      }
    },
    selectFile(index: number) {
      if (this.isUploading) {
        return
      }
      const fileInput = (this.$refs.fileInput as HTMLInputElement[] | undefined)?.[index]
      if (fileInput) {
        fileInput.click()
      }
    },
    selectFiles() {
      if (this.isUploading) {
        return
      }
      const fileInputRef = this.$refs.newfilesInput as HTMLInputElement
      if (fileInputRef) {
        fileInputRef.click()
      }
    },
    add(
      previewType: any,
      previewUrl: string | ArrayBuffer | null,
      previewName: string,
      isDragging: boolean,
      isLoading: boolean
    ) {
      this.filesPreview.push({
        previewType: previewType,
        previewUrl: previewUrl,
        previewName: previewName,
        isDragging: isDragging,
        isLoading: isLoading
      })
    },
    update(
      previewType: any,
      previewUrl: string | ArrayBuffer | null,
      previewName: string,
      isDragging: boolean,
      index: number
    ) {
      this.filesPreview[index].previewType = previewType
      this.filesPreview[index].previewUrl = previewUrl
      this.filesPreview[index].previewName = previewName
      this.filesPreview[index].isDragging = isDragging
    },
    removeImg(index: any) {
      if (this.isUploading) {
        return
      }
      this.filesPreview.splice(index, 1)
      this.files.splice(index, 1)
    },
    uploadDefaultImage(event: any, index: number, action: string) {
      const files = event.target.files
      for (var i = 0; i < files.length; i++) {
        try {
          this.previewFile(files[i], index + i, action)
        } catch (error) {
          console.error('error : ', error)
        }
      }
    },
    previewFile(file: any, index: number, action: string) {
      const reader = new FileReader()
      reader.onload = () => {
        var obj = {
          previewType: 'image',
          previewUrl: placeHolderImage as string | ArrayBuffer | null,
          previewName: file.name,
          isDragging: false
        }

        if (file.type.startsWith('image/')) {
          obj.previewUrl = reader.result
        } else if (file.type === 'text/plain') {
          obj.previewUrl = this.textPreview
        } else if (file.type === 'application/pdf') {
          obj.previewUrl = this.pdfPreview
        } else if (file.type.startsWith('video/')) {
          obj.previewType = 'video'
          obj.previewUrl = URL.createObjectURL(file)
        } else if (file.type.startsWith('audio/')) {
          obj.previewUrl = this.audioPreview
        } else if (file.type === 'application/vnd.android.package-archive') {
          obj.previewUrl = this.apkPreview
        } else if (file.type === 'application/zip') {
          obj.previewUrl = this.zipPreview
        } else if (file.type === 'application/sql') {
          obj.previewUrl = this.sqlPreview
        } else {
          obj.previewUrl = this.filePreview
        }

        if (action == 'reset') {
          this.update(obj.previewType, obj.previewUrl, obj.previewName, obj.isDragging, index)
          this.files[index] = file
        } else {
          this.add(obj.previewType, obj.previewUrl, obj.previewName, obj.isDragging, false)
          this.files.push(file)
        }
      }
      reader.onerror = (error) => {
        console.error(`Error reading file ${file.name}: ${error}`)
      }
      reader.readAsDataURL(file)
    },
    handleDragOver(event: any, index: number, action: string) {
      if (this.isUploading) {
        return
      }
      event.preventDefault()
      if (action == 'reset') {
        this.filesPreview[index].isDragging = true
        this.filesPreview[index].isLoading = true
        setTimeout(() => {
          this.filesPreview[index].isLoading = false
        }, 500)
      } else {
        this.isDragging = true
        this.isLoading = true
        setTimeout(() => {
          this.isLoading = false
        }, 500)
      }
    },
    handleDragLeave(event: any, index: number, action: string) {
      event.preventDefault()
      if (action == 'reset') {
        this.filesPreview[index].isDragging = false
        this.filesPreview[index].isLoading = false
      } else {
        this.isDragging = false
        this.isLoading = false
      }
    },
    handleDrop(event: any, index: number, action: string) {
      if (this.isUploading) {
        return
      }
      event.preventDefault()
      if (action == 'reset') {
        this.filesPreview[index].isDragging = false
        this.filesPreview[index].isLoading = false
      } else {
        this.isDragging = false
        this.isLoading = false
      }
      const files = event.dataTransfer.files
      for (var i = 0; i < files.length; i++) {
        try {
          if (this.accept ? this.accept.split(', ').includes(files[i].type) : true) {
            this.previewFile(files[i], index + i, action)
          }
        } catch (error) {
          console.error('error : ', error)
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@mixin gradient-striped($color: rgba(255, 255, 255, 0.15), $angle: 45deg) {
  background-image: -webkit-linear-gradient(
    $angle,
    $color 25%,
    transparent 25%,
    transparent 50%,
    $color 50%,
    $color 75%,
    transparent 75%,
    transparent
  );
  background-image: -o-linear-gradient(
    $angle,
    $color 25%,
    transparent 25%,
    transparent 50%,
    $color 50%,
    $color 75%,
    transparent 75%,
    transparent
  );
  background-image: linear-gradient(
    $angle,
    $color 25%,
    transparent 25%,
    transparent 50%,
    $color 50%,
    $color 75%,
    transparent 75%,
    transparent
  );
}

@-webkit-keyframes progress-bar-stripes {
  from {
    background-position: 40px 0;
  }
  to {
    background-position: 0 0;
  }
}

@keyframes progress-bar-stripes {
  from {
    background-position: 40px 0;
  }
  to {
    background-position: 0 0;
  }
}

@mixin animation($animation) {
  -webkit-animation: $animation;
  -o-animation: $animation;
  animation: $animation;
}
.progress.active .progress-bar {
  @include animation(progress-bar-stripes 2s linear infinite);
}
.progress-striped .progress-bar {
  @include gradient-striped;
  background-size: 40px 40px;
}
</style>
