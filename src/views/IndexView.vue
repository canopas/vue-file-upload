<template>
  <div class="flex flex-wrap">
    <SingleFileUpload @file="receiveFile" :isUploading="isUploading" @uploading="uploadingStatus">
      <template v-slot="file">
        <div class="m-5">
          <div class="flex items-center justify-center">
            <label
              v-if="!file.file.previewUrl"
              for="dropzone-file"
              class="flex flex-col items-center justify-center w-full h-56 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
            >
              <div class="flex flex-col items-center justify-center pt-5 pb-6 px-10">
                <svg
                  class="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 16"
                >
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                  />
                </svg>
                <p class="mb-2 text-sm text-gray-500 dark:text-gray-400">
                  <span class="font-semibold">Click to upload</span> or drag and drop
                </p>
                <p class="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG or GIF</p>
              </div>
            </label>
            <div v-else>
              <div class="w-full h-64">
                <img
                  v-if="file.file.previewType != 'video'"
                  class="h-full w-full object-contain rounded-2xl"
                  :src="file.file.previewUrl"
                />
                <video v-else autoplay loop class="h-full w-full object-contain">
                  <source :src="file.file.previewUrl" type="video/mp4" />
                </video>
              </div>
            </div>
          </div>
          <p class="flex items-center justify-center text-center w-3/4">
            {{ file.file ? file.file.previewName : '' }}
          </p>
        </div>
      </template>
    </SingleFileUpload>
  </div>
  <br />
  <hr />
  <div class="flex flex-wrap">
    <MultipleFile
      :uploadBtn="'Upload'"
      :progressBtn="'Uploading...'"
      :isUploading="isUploading"
      @uploading="uploadingStatus"
      @files="receiveFilesArray"
    >
      <template v-slot="file">
        <div class="m-5">
          <div class="flex items-center justify-center">
            <label
              v-if="!file.file"
              for="dropzone-file"
              class="flex flex-col items-center justify-center w-full h-56 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
            >
              <div class="flex flex-col items-center justify-center pt-5 pb-6 px-10">
                <svg
                  class="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 16"
                >
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                  />
                </svg>
                <p class="mb-2 text-sm text-gray-500 dark:text-gray-400">
                  <span class="font-semibold">Click to upload</span> or drag and drop
                </p>
                <p class="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG or GIF</p>
              </div>
            </label>
            <div v-else>
              <div class="w-full h-64">
                <img
                  v-if="file.file.previewType != 'video'"
                  class="h-full w-full object-contain rounded-2xl"
                  :src="file.file.previewUrl"
                />
                <video v-else autoplay loop class="h-full w-full object-contain">
                  <source :src="file.file.previewUrl" type="video/mp4" />
                </video>
              </div>
            </div>
          </div>
          <p class="flex items-center justify-center text-center w-3/4">
            {{ file.file ? file.file.previewName : '' }}
          </p>
        </div>
      </template>
    </MultipleFile>
  </div>
  <hr />
  <div class="flex flex-wrap mt-10">
    <MultipleFile
      :removeBtn="'remove'"
      :uploadBtn="'Upload'"
      :progressBtn="'Uploading...'"
      :isUploading="isUploading"
      @uploading="uploadingStatus"
    >
      <template v-slot="file">
        <div
          class="h-[100px] w-[500px] cursor-pointer mb-10 ms-10 border rounded-2xl overflow-hidden dark:border-slate-700"
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
    </MultipleFile>
  </div>
  <hr />
  <div class="flex flex-wrap">
    <MultipleFile
      @files="receiveFilesArray"
      :isUploading="isUploading"
      @uploading="uploadingStatus"
    >
      <template v-slot="file">
        <div
          class="h-[195px] w-[195px] cursor-pointer mx-5 bg-[#e7e7e7] rounded-full"
          :class="!file.file ? 'my-10' : 'mt-10 mb-20'"
        >
          <div class="flex h-full w-full relative">
            <div class="h-full w-full">
              <img
                v-if="file.file ? file.file.previewType != 'video' : true"
                class="h-full w-full"
                :class="file.file ? 'object-cover rounded-full' : 'object-contain'"
                :src="file.file ? file.file.previewUrl : placeHolderImage"
              />
              <video
                v-else
                autoplay
                loop
                class="h-full w-full"
                :class="file.file ? 'object-cover rounded-full' : 'object-contain'"
              >
                <source :src="file.file.previewUrl" type="video/mp4" />
              </video>
            </div>
            <div
              v-if="file.file"
              :class="{
                'absolute h-full w-full flex rounded-full bg-[#00000099]': file.file.isDragging,
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
          </div>
          <p v-if="file.file" class="text-center break-words">
            {{ file.file.previewName }}
          </p>
        </div>
      </template>
    </MultipleFile>
  </div>
</template>

<script lang="ts">
import placeHolderImage from '../assets/images/placeholder.png'
import MultipleFile from '../components/MultipleFile.vue'
import SingleFileUpload from '../components/SingleFile.vue'

export default {
  name: 'IndexView',
  components: {
    MultipleFile,
    SingleFileUpload
  },
  data() {
    return {
      placeHolderImage,
      received: {} as Object,
      receivedArray: [],
      isUploading: false
    }
  },
  methods: {
    receiveFilesArray(array: []) {
      this.receivedArray = array
    },
    receiveFile(file: any) {
      this.received = file
    },
    uploadingStatus(isUploading: any) {
      this.isUploading = isUploading
      setTimeout(() => {
        this.isUploading = !isUploading
      }, 5000)
    }
  }
}
</script>
