<template>
  <div class="flex">
    <div
      class="cursor-pointer"
      @click="selectFile()"
      @dragover.prevent="handleDragOver($event)"
      @dragleave.prevent="handleDragLeave($event)"
      @drop="handleDrop($event)"
    >
      <slot :file="file"></slot>
      <input
        ref="fileInput"
        type="file"
        class="hidden"
        :accept="accept"
        @change="handleFileChange($event)"
      />
    </div>
    <div class="upload-btn relative" :class="{ 'progress progress-striped active': isUploading }">
      <button
        type="button"
        class="flex items-center justify-center bg-slate-700 dark:text-slate-300 dark:bg-blue-700 text-white flex-none py-3 px-8 rounded-full bottom-0 absolute disabled:opacity-70 disabled:cursor-not-allowed"
        :class="{ 'progress-bar cursor-wait': isUploading }"
        @click="uploadingFunction"
        :disabled="!file.previewUrl"
      >
        {{ isUploading ? progressBtn : uploadBtn }}
      </button>
    </div>
  </div>

  <div class="hidden" v-if="!isUploading ? removePreviewFile() : ''"></div>
</template>

<script lang="ts">
// import img from '../assets/images/placeholder.png'
import pdfPreview from '../assets/images/pdf-icon.png'
import textPreview from '../assets/images/text-icon.png'
import audioPreview from '../assets/images/music-icon.png'
import apkPreview from '../assets/images/apk-icon.png'
import zipPreview from '../assets/images/zip-icon.png'
import sqlPreview from '../assets/images/sql-icon.png'
import filePreview from '../assets/images/file-icon.png'

export default {
  emits: ['file', 'uploading'],
  props: {
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
      file: {} as {
        previewType: string
        previewUrl: string | ArrayBuffer | null
        previewName: string
        isDragging: boolean
        isLoading: boolean
      }
    }
  },
  methods: {
    removePreviewFile() {
      if (this.flag == 1) {
        this.flag = 0
        this.file = {} as {
          previewType: string
          previewUrl: string | ArrayBuffer | null
          previewName: string
          isDragging: boolean
          isLoading: boolean
        }
      }
    },
    uploadingFunction() {
      this.$emit('file', this.file)
      this.$emit('uploading', true)
      this.flag = 1
    },
    selectFile() {
      if (this.isUploading) {
        return
      }
      const fileInputRef = this.$refs.fileInput as HTMLInputElement
      if (fileInputRef) {
        fileInputRef.click()
      }
    },
    handleFileChange(event: any) {
      const file = event.target.files[0]
      if (file) {
        this.previewFile(file)
      }
    },
    previewFile(file: any) {
      this.file.previewType = 'image'
      const reader = new FileReader()
      reader.onload = () => {
        if (file.type.startsWith('image/')) {
          this.file.previewUrl = reader.result
        } else if (file.type === 'text/plain') {
          this.file.previewUrl = this.textPreview
        } else if (file.type === 'application/pdf') {
          this.file.previewUrl = this.pdfPreview
        } else if (file.type.startsWith('video/')) {
          this.file.previewType = 'video'
          this.file.previewUrl = URL.createObjectURL(file)
        } else if (file.type.startsWith('audio/')) {
          this.file.previewUrl = this.audioPreview
        } else if (file.type === 'application/vnd.android.package-archive') {
          this.file.previewUrl = this.apkPreview
        } else if (file.type === 'application/zip') {
          this.file.previewUrl = this.zipPreview
        } else if (file.type === 'application/sql') {
          this.file.previewUrl = this.sqlPreview
        } else {
          this.file.previewUrl = this.filePreview
        }
      }
      this.file.previewName = file.name
      reader.onerror = (error) => {
        console.error(`Error reading file ${file.name}: ${error}`)
      }
      reader.readAsDataURL(file)
    },
    handleDragOver(event: any) {
      if (this.isUploading) {
        return
      }
      event.preventDefault()
      this.file.isDragging = true
    },
    handleDragLeave(event: any) {
      event.preventDefault()
      this.file.isDragging = false
    },
    handleDrop(event: any) {
      if (this.isUploading) {
        return
      }
      event.preventDefault()
      this.file.isDragging = false

      const file = event.dataTransfer.files[0]
      if (file) {
        this.previewFile(file)
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
