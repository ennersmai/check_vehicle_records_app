<template>
  <div class="rich-text-editor border border-gray-200 rounded-lg overflow-hidden">
    <!-- Toolbar -->
    <div class="bg-gray-50 border-b border-gray-200 p-2 flex flex-wrap gap-1">
      <!-- Text Style -->
      <div class="flex items-center gap-1 border-r border-gray-300 pr-2">
        <button
          @click="editor.chain().focus().toggleBold().run()"
          :class="{ 'bg-primary text-white': editor.isActive('bold') }"
          class="p-2 rounded hover:bg-gray-200 transition"
          title="Bold"
        >
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M13.5,15.5H10V12.5H13.5A1.5,1.5 0 0,1 15,14A1.5,1.5 0 0,1 13.5,15.5M10,6.5H13A1.5,1.5 0 0,1 14.5,8A1.5,1.5 0 0,1 13,9.5H10M15.6,10.79C16.57,10.11 17.25,9 17.25,8C17.25,5.74 15.5,4 13.25,4H7V18H14.04C16.14,18 17.75,16.3 17.75,14.21C17.75,12.69 16.89,11.39 15.6,10.79Z" />
          </svg>
        </button>
        <button
          @click="editor.chain().focus().toggleItalic().run()"
          :class="{ 'bg-primary text-white': editor.isActive('italic') }"
          class="p-2 rounded hover:bg-gray-200 transition"
          title="Italic"
        >
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M10,4V7H12.5L17,20H14.5L10,7V4M10,4H8V20H10V19H12.5L17,20H19V17H16.5L12,4H10Z" />
          </svg>
        </button>
        <button
          @click="editor.chain().focus().toggleUnderline().run()"
          :class="{ 'bg-primary text-white': editor.isActive('underline') }"
          class="p-2 rounded hover:bg-gray-200 transition"
          title="Underline"
        >
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M5,21H19V19H5V21M12,17A6,6 0 0,0 18,11V3H15.5V11A3.5,3.5 0 0,1 12,14.5A3.5,3.5 0 0,1 8.5,11V3H6V11A6,6 0 0,0 12,17Z" />
          </svg>
        </button>
      </div>

      <!-- Headings -->
      <div class="flex items-center gap-1 border-r border-gray-300 pr-2">
        <button
          @click="editor.chain().focus().toggleHeading({ level: 1 }).run()"
          :class="{ 'bg-primary text-white': editor.isActive('heading', { level: 1 }) }"
          class="p-2 rounded hover:bg-gray-200 transition text-sm font-bold"
          title="Heading 1"
        >
          H1
        </button>
        <button
          @click="editor.chain().focus().toggleHeading({ level: 2 }).run()"
          :class="{ 'bg-primary text-white': editor.isActive('heading', { level: 2 }) }"
          class="p-2 rounded hover:bg-gray-200 transition text-sm font-bold"
          title="Heading 2"
        >
          H2
        </button>
        <button
          @click="editor.chain().focus().toggleHeading({ level: 3 }).run()"
          :class="{ 'bg-primary text-white': editor.isActive('heading', { level: 3 }) }"
          class="p-2 rounded hover:bg-gray-200 transition text-sm font-bold"
          title="Heading 3"
        >
          H3
        </button>
      </div>

      <!-- Lists -->
      <div class="flex items-center gap-1 border-r border-gray-300 pr-2">
        <button
          @click="editor.chain().focus().toggleBulletList().run()"
          :class="{ 'bg-primary text-white': editor.isActive('bulletList') }"
          class="p-2 rounded hover:bg-gray-200 transition"
          title="Bullet List"
        >
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M7,5H21V7H7V5M7,13V11H21V13H7M4,4.5A1.5,1.5 0 0,1 5.5,6A1.5,1.5 0 0,1 4,7.5A1.5,1.5 0 0,1 2.5,6A1.5,1.5 0 0,1 4,4.5M4,10.5A1.5,1.5 0 0,1 5.5,12A1.5,1.5 0 0,1 4,13.5A1.5,1.5 0 0,1 2.5,12A1.5,1.5 0 0,1 4,10.5M4,16.5A1.5,1.5 0 0,1 5.5,18A1.5,1.5 0 0,1 4,19.5A1.5,1.5 0 0,1 2.5,18A1.5,1.5 0 0,1 4,16.5M7,19V17H21V19H7Z" />
          </svg>
        </button>
        <button
          @click="editor.chain().focus().toggleOrderedList().run()"
          :class="{ 'bg-primary text-white': editor.isActive('orderedList') }"
          class="p-2 rounded hover:bg-gray-200 transition"
          title="Numbered List"
        >
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M7,13V21H9V19H10V17H9V15H10V13H9M10,21V13H14V15H12V17H14V19H12V21H10M17,15H19V13H17V15M17,19H19V17H17V19M21,9H3V11H21V9M21,5H3V7H21V5" />
          </svg>
        </button>
      </div>

      <!-- Text Color -->
      <div class="flex items-center gap-1 border-r border-gray-300 pr-2">
        <input
          type="color"
          @change="(e: any) => editor.chain().focus().setColor(e.target.value).run()"
          :value="editor.getAttributes('textStyle').color || '#000000'"
          class="w-8 h-8 rounded cursor-pointer"
          title="Text Color"
        />
      </div>

      <!-- Other Actions -->
      <div class="flex items-center gap-1">
        <button
          @click="editor.chain().focus().undo().run()"
          :disabled="!editor.can().undo()"
          class="p-2 rounded hover:bg-gray-200 transition disabled:opacity-50"
          title="Undo"
        >
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12.5,8C9.85,8 7.45,9 5.6,10.6L2,7V16H11L7.38,12.38C8.77,11.22 10.54,10.5 12.5,10.5C16.04,10.5 19.05,12.81 20.1,16L22.47,15.22C21.08,11.03 17.15,8 12.5,8Z" />
          </svg>
        </button>
        <button
          @click="editor.chain().focus().redo().run()"
          :disabled="!editor.can().redo()"
          class="p-2 rounded hover:bg-gray-200 transition disabled:opacity-50"
          title="Redo"
        >
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M18.4,10.6C16.55,9 14.15,8 11.5,8C6.85,8 2.92,11.03 1.54,15.22L3.9,16C4.95,12.81 7.95,10.5 11.5,10.5C13.45,10.5 15.23,11.22 16.62,12.38L13,16H22V7L18.4,10.6Z" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Editor -->
    <div class="prose max-w-none p-4 min-h-[300px] focus:outline-none">
      <editor-content :editor="editor" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import { TextStyle } from '@tiptap/extension-text-style'
import Color from '@tiptap/extension-color'
import Underline from '@tiptap/extension-underline'
import Heading from '@tiptap/extension-heading'

const props = defineProps<{
  modelValue: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const editor = useEditor({
  content: props.modelValue,
  extensions: [
    StarterKit,
    TextStyle,
    Color,
    Underline,
  ],
  onUpdate: ({ editor }) => {
    emit('update:modelValue', editor.getHTML())
  },
})

// Watch for external changes
watch(() => props.modelValue, (newValue) => {
  if (editor.value && newValue !== editor.value.getHTML()) {
    editor.value.commands.setContent(newValue)
  }
})

onBeforeUnmount(() => {
  if (editor.value) {
    editor.value.destroy()
  }
})
</script>

<style scoped>
/* Custom styles for the editor */
:deep(.ProseMirror) {
  outline: none;
}

:deep(.ProseMirror p) {
  margin-bottom: 1rem;
}

:deep(.ProseMirror h1) {
  font-size: 2.25rem;
  font-weight: bold;
  line-height: 1.2;
  margin-bottom: 1rem;
}

:deep(.ProseMirror h2) {
  font-size: 1.875rem;
  font-weight: bold;
  line-height: 1.2;
  margin-bottom: 1rem;
}

:deep(.ProseMirror h3) {
  font-size: 1.5rem;
  font-weight: bold;
  line-height: 1.2;
  margin-bottom: 1rem;
}

:deep(.ProseMirror ul) {
  list-style-type: disc;
  margin-left: 1.5rem;
  margin-bottom: 1rem;
}

:deep(.ProseMirror ol) {
  list-style-type: decimal;
  margin-left: 1.5rem;
  margin-bottom: 1rem;
}

:deep(.ProseMirror li) {
  margin-bottom: 0.25rem;
}

:deep(.ProseMirror strong) {
  font-weight: bold;
}

:deep(.ProseMirror em) {
  font-style: italic;
}

:deep(.ProseMirror u) {
  text-decoration: underline;
}
</style>
