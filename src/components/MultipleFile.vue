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
      class="remove-btn bg-[#ccc] h-7 rounded-full dark:bg-stone-500 dark:text-white px-2.5"
      @click="removeImg(k)"
    >
      {{ removeBtnText }}
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
      :disabled="filesPreview.length == 0 ? (files.length == 0 ? true : false) : false"
    >
      {{ isUploading ? progressBtnText : uploadBtnText }}
    </button>
  </div>
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
import type { PropType } from 'vue'

export default {
  props: {
    accept: {
      type: String
    },
    removeBtnText: {
      type: String,
      default: 'x'
    },
    uploadBtnText: {
      type: String,
      default: 'Upload'
    },
    progressBtnText: {
      type: String,
      default: 'Uploading...'
    },
    uploadedFiles: {
      type: Array as PropType<
        Array<{
          fileType: string
          fileUrl: string
          fileName: string
        }>
      >,
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
      isDragging: false,
      isUploading: false,
      errorAlertVisible: false,
      errorMessage: 'Something went wrong',
      settingSavedSuccess: false,
      filesPreview: [] as Array<{
        previewType: string
        previewUrl: string | ArrayBuffer | null
        previewName: string
        isDragging: boolean
      }>,
      files: [] as any
    }
  },
  mounted() {
    if (this.uploadedFiles) {
      for (var i = 0; i < this.uploadedFiles.length; i++) {
        this.filesPreview.push({
          previewType: this.uploadedFiles[i].fileType,
          previewUrl: this.uploadedFiles[i].fileUrl,
          previewName: this.uploadedFiles[i].fileName,
          isDragging: false
        })
        this.files.push({
          fileType: this.uploadedFiles[i].fileType,
          fileUrl: this.uploadedFiles[i].fileUrl,
          fileName: this.uploadedFiles[i].fileName
        })
      }
    }
  },
  methods: {
    async uploadingFunction() {
      if (this.files.length > 0) {
        this.isUploading = true
        await this.callback(this.files)
        this.filesPreview = []
        this.files = []
        if (this.uploadedFiles) {
          for (var i = 0; i < this.uploadedFiles.length; i++) {
            this.filesPreview.push({
              previewType: this.uploadedFiles[i].fileType,
              previewUrl: this.uploadedFiles[i].fileUrl,
              previewName: this.uploadedFiles[i].fileName,
              isDragging: false
            })
            this.files.push({
              fileType: this.uploadedFiles[i].fileType,
              fileUrl: this.uploadedFiles[i].fileUrl,
              fileName: this.uploadedFiles[i].fileName
            })
          }
        }
        this.isUploading = false
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
      isDragging: boolean
    ) {
      this.filesPreview.push({
        previewType: previewType,
        previewUrl: previewUrl,
        previewName: previewName,
        isDragging: isDragging
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
          this.add(obj.previewType, obj.previewUrl, obj.previewName, obj.isDragging)
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
      } else {
        this.isDragging = true
      }
    },
    handleDragLeave(event: any, index: number, action: string) {
      event.preventDefault()
      if (action == 'reset') {
        this.filesPreview[index].isDragging = false
      } else {
        this.isDragging = false
      }
    },
    handleDrop(event: any, index: number, action: string) {
      if (this.isUploading) {
        return
      }
      event.preventDefault()
      if (action == 'reset') {
        this.filesPreview[index].isDragging = false
      } else {
        this.isDragging = false
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
