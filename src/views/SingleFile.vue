<template>
  <div class="box">
    <div class="one">
      <div v-if="previewUrl" class="three">
        <img v-if="previewType != 'video'" :src="previewUrl" alt="File Preview" />
        <video v-else autoplay loop>
          <source :src="previewUrl" type="video/mp4" />
        </video>
        <p style="text-align: center">
          {{ previewName }}
        </p>
      </div>
      <input class="two" ref="selectFile" type="file" @change="handleFileChange" />
      <div :class="{ dragged: isDragging }"></div>
    </div>
    <div
      @click="selectFile"
      @dragover.prevent="handleDragOver"
      @dragleave.prevent="handleDragLeave"
      @drop="handleDrop"
      class="four"
    ></div>
  </div>
</template>

<script lang="ts">
import img from '@/assets/images/placeholder.png'
import pdfImg from '@/assets/images/pdf-icon.png'
import textImg from '@/assets/images/text-icon.png'
export default {
  data() {
    return {
      previewUrl: img,
      previewType: '',
      previewName: '',
      isDragging: false
    }
  },
  methods: {
    selectFile() {
      this.$refs.selectFile.click()
    },
    handleFileChange(event: any) {
      const file = event.target.files[0]
      if (file) {
        this.previewFile(file)
      }
    },
    previewFile(file: any) {
      this.previewType = ''
      const reader = new FileReader()
      reader.onload = () => {
        this.previewUrl = reader.result
        this.determineFileType(file)
      }
      reader.readAsDataURL(file)
    },
    determineFileType(file: any) {
      if (file.type === 'text/plain') {
        this.previewUrl = textImg
      } else if (file.type === 'application/pdf') {
        this.previewUrl = pdfImg
      } else if (file.type.startsWith('video/')) {
        this.previewType = 'video'
        this.previewUrl = URL.createObjectURL(file)
      }
      // this.readTextFile(file)
      this.previewName = file.name
    },
    // readTextFile(file: any) {
    //   const reader = new FileReader()

    //   reader.onload = () => {
    //     this.fileContent = reader.result
    //   }

    //   reader.readAsText(file)
    // },
    handleDragOver(event: any) {
      event.preventDefault()
      this.isDragging = true
    },
    handleDragLeave(event: any) {
      event.preventDefault()
      this.isDragging = false
    },
    handleDrop(event: any) {
      event.preventDefault()
      this.isDragging = false

      const file = event.dataTransfer.files[0]
      if (file) {
        this.previewFile(file)
      }
    }
  }
}
</script>
