<template>
  <p class="mt-5 ms-6">Single File Upload</p>
  <div class="flex flex-wrap mt-10">
    <SingleFileUpload
      :uploadBtn="'Upload'"
      :progressBtn="'Uploading...'"
      :isUploading="isSingleFileUploading"
      @uploading="singleFileUploadingStatus"
    >
      <template v-slot="file">
        <div
          class="h-[100px] w-[500px] cursor-pointer mb-10 ms-5 border rounded-2xl overflow-hidden dark:border-slate-700"
        >
          <div class="flex h-full w-full relative">
            <div class="h-full w-1/4" :class="!file.file.previewType ? 'p-3' : ''">
              <img
                v-if="file.file ? file.file.previewType != 'video' : true"
                class="h-full w-full object-cover"
                :src="file.file.previewUrl ? file.file.previewUrl : placeHolderImage"
              />
              <video v-else autoplay loop class="h-full w-full object-cover">
                <source :src="file.file.previewUrl" type="video/mp4" />
              </video>
            </div>
            <div
              v-if="file.file"
              :class="{
                'absolute h-full w-1/4 flex rounded-2xl bg-[#00000099]': file.file.isDragging,
                'items-center justify-center': file.file.isLoading
              }"
            >
              <img
                v-if="file.file.isLoading"
                src="../assets/images/loader.png"
                alt="Loading..."
                class="h-16 animate-spin"
              />
            </div>
            <p class="flex items-center justify-center text-center w-3/4">
              {{
                file.file.previewName
                  ? file.file.previewName
                  : 'Click to upload or drag and drop files'
              }}
            </p>
          </div>
        </div>
      </template>
    </SingleFileUpload>
  </div>
  <br />
  <hr />
  <p class="mt-5 ms-6">Multiple File Upload</p>
  <div class="flex flex-wrap mt-10">
    <MultipleFileUpload
      :removeBtn="'remove'"
      :uploadBtn="'Save'"
      :progressBtn="'Saving...'"
      :isUploading="isMultipleFileUploading"
      @uploading="multipleFileUploadingStatus"
    >
      <template v-slot="file">
        <div
          class="h-[100px] w-[500px] cursor-pointer mb-10 ms-5 border rounded-2xl overflow-hidden dark:border-slate-700"
        >
          <div class="flex h-full w-full relative">
            <div class="h-full w-1/4" :class="!file.file ? 'p-3' : ''">
              <img
                v-if="file.file ? file.file.previewType != 'video' : true"
                class="h-full w-full object-cover"
                :src="file.file ? file.file.previewUrl : placeHolderImage"
              />
              <video v-else autoplay loop class="h-full w-full object-cover">
                <source :src="file.file.previewUrl" type="video/mp4" />
              </video>
            </div>
            <div
              v-if="file.file"
              :class="{
                'absolute h-full w-1/4 flex rounded-2xl bg-[#00000099]': file.file.isDragging,
                'items-center justify-center': file.file.isLoading
              }"
            >
              <img
                v-if="file.file.isLoading"
                src="../assets/images/loader.png"
                alt="Loading..."
                class="h-16 animate-spin"
              />
            </div>
            <p class="flex items-center justify-center text-center w-3/4">
              {{ file.file ? file.file.previewName : 'Click to upload or drag and drop files' }}
            </p>
          </div>
        </div>
      </template>
    </MultipleFileUpload>
  </div>
</template>

<script lang="ts">
import placeHolderImage from '../assets/images/placeholder.png' // add placeholder image on this location or you can update file path

export default {
  name: 'IndexView',
  data() {
    return {
      placeHolderImage,
      received: {} as Object,
      receivedArray: [],
      // it's a required thing to pass in component
      isSingleFileUploading: false,
      isMultipleFileUploading: false
    }
  },
  methods: {
    receiveFile(file: any) {
      this.received = file // here you will get the file from preview
    },
    receiveFilesArray(array: []) {
      this.receivedArray = array // here you will get all the files from preview
    },
    singleFileUploadingStatus(isUploading: any) {
      this.isSingleFileUploading = isUploading
      // remove setTimeout and add your uploading logic here, when you successfully uploaded all the files, update the value of isUploading = false
      setTimeout(() => {
        this.isSingleFileUploading = !isUploading
      }, 5000)
    },
    multipleFileUploadingStatus(isUploading: any) {
      this.isMultipleFileUploading = isUploading
      // remove setTimeout and add your uploading logic here, when you successfully uploaded all the files, update the value of isUploading = false
      setTimeout(() => {
        this.isMultipleFileUploading = !isUploading
      }, 5000)
    }
  }
}
</script>
