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
        {{ isUploading ? progressBtnText : uploadBtnText }}
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import pdfPreview from '../assets/images/pdf-icon.png'
import textPreview from '../assets/images/text-icon.png'
import audioPreview from '../assets/images/music-icon.png'
import apkPreview from '../assets/images/apk-icon.png'
import zipPreview from '../assets/images/zip-icon.png'
import sqlPreview from '../assets/images/sql-icon.png'
import filePreview from '../assets/images/file-icon.png'
import type { PropType } from 'vue'

export default {
  props: {
    accept: {
      type: String
    },
    uploadBtnText: {
      type: String,
      default: 'Upload'
    },
    progressBtnText: {
      type: String,
      default: 'Uploading...'
    },
    uploadedFile: {
      type: Object as PropType<{
        fileType: string
        fileUrl: string
        fileName: string
      }>,
      required: true
    },
    callback: {
      type: Function,
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
      isUploading: false,
      file: {} as {
        previewType: string
        previewUrl: string | ArrayBuffer | null
        previewName: string
        isDragging: boolean
      },
      fileObj: {}
    }
  },
  mounted() {
    if (this.uploadedFile) {
      this.file.previewType = this.uploadedFile.fileType
      this.file.previewUrl = this.uploadedFile.fileUrl
      this.file.previewName = this.uploadedFile.fileName
    }
  },
  methods: {
    async uploadingFunction() {
      this.isUploading = true
      await this.callback(this.fileObj)

      this.file = {} as {
        previewType: string
        previewUrl: string | ArrayBuffer | null
        previewName: string
        isDragging: boolean
      }

      if (this.uploadedFile) {
        this.file.previewType = this.uploadedFile.fileType
        this.file.previewUrl = this.uploadedFile.fileUrl
        this.file.previewName = this.uploadedFile.fileName
        this.fileObj = this.uploadedFile
      }

      this.isUploading = false
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
        this.fileObj = file
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
