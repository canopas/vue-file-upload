<template>
  <p class="mt-5 ms-6">Single File Upload</p>
  <div class="flex flex-wrap mt-10">
    <SingleFileUpload :uploadedFile="uploadedFile" :callback="handleFileUploading">
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
                alt=""
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
      :removeBtnText="'remove'"
      :uploadBtnText="'Save'"
      :progressBtnText="'Saving...'"
      :uploadedFiles="uploadedFiles"
      :callback="handleMultipleFileUpload"
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
import { SingleFileUpload, MultipleFileUpload } from '@canopassoftware/vue-file-upload'

export default {
  components: {
    MultipleFileUpload,
    SingleFileUpload
  },
  data() {
    return {
      uploadedFile: {} as {
        fileType: string
        fileUrl: string
        fileName: string
      },
      uploadedFiles: [] as Array<{
        fileType: string
        fileUrl: string
        fileName: string
      }>
    }
  },
  methods: {
    async handleFileUploading(file: any) {
      // add your fileuploading logic to server and set data to the uploadedFile
      this.uploadedFile.fileType = 'image'
      this.uploadedFile.fileUrl = 'https://picsum.photos/300/224'
      this.uploadedFile.fileName = file.name

      await new Promise((resolve) => setTimeout(resolve, 2000))
    },
    async handleMultipleFileUpload(files: any) {
      this.uploadedFiles = []

      // add your fileuploading logic to server and set data to the uploadedFiles
      for (var i = 0; i < files.length; i++) {
        this.uploadedFiles.push({
          fileType: 'image',
          fileUrl: 'https://picsum.photos/300/224',
          fileName: 'example-image.jpg'
        })
      }

      await new Promise((resolve) => setTimeout(resolve, 2000))
    }
  }
}
</script>
