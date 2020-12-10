<template>
  <div>
    <EditorProfile />
    <EditorProfessionalOverview />
    <EditorWorkHistory></EditorWorkHistory>
    <EditorSkill />
    <EditorEducation />
    <EditorCertificate />
    <EditorProject></EditorProject>
  </div>
</template>

<script>
import EditorProfessionalOverview from '@/components/Editor/EditorProfessionalOverview'
import EditorProfile from '@/components/Editor/EditorProfile'
import EditorEducation from '@/components/Editor/EditorEducation.vue'
import EditorSkill from '@/components/Editor/EditorSkill'
import EditorCertificate from '@/components/Editor/EditorCertificate'
import EditorWorkHistory from '@/components/Editor/EditorWorkHistory'

import EditorProject from '@/components/Editor/EditorProject'
export default {
  name: 'Index',
  components: {
    EditorProject,
    EditorProfile,
    EditorProfessionalOverview,
    EditorEducation,
    EditorSkill,
    EditorCertificate,
    EditorWorkHistory,
  },
}
</script>

<style lang="scss">
.edit-container {
  background-color: #ffffff;
  border-radius: 5px;
  box-shadow: 0px 3px 1px -2px rgba(0, 0, 0, 0.2),
    0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12);

  &__header {
    border-bottom: 1px solid #eeeeee;
  }
}
</style>
