<template>
  <div class="main container__resume">
    <section class="header d-flex">
      <div class="header__logo ml-5 mt-5 w-40">
        <img
          ref="userImage"
          :src="require('@/assets/images/logo-hybrid-technology.svg')"
          alt="HYBRID TECHNOLOGIES"
          height="80"
        />
      </div>
      <div class="header__content w-60 mr-16">
        <p class="header__content--des mb-1">
          Human Resources Department -Hybrid Technologies Co,Ltd.
        </p>
        <p class="header__content--des mb-1">
          Address:9th Floor,Viet A Tower,Duy Tan Str, Cau Giay Dist, Ha Noi,
          Viet Nam 19F, Ichigo Shinkawa Building,2-22-1 Shinkawa ,Chuo-ku,Tokyo
          104-0033 Japan
        </p>
        <p class="header__content--des mb-1">
          Website:
          <a href="javascript:void(0)">https://hybrid-technologies.co.jp/</a>
        </p>
      </div>
    </section>
    <section class="pdf__item d-flex">
      <div class="pdf__item-left w-auto">
        <div class="pdf__item--header text-uppercase">
          {{ personInfo.FullName }}
        </div>
        <div class="table">
          <table>
            <tr>
              <td width="150">Gender</td>
              <td>{{ personInfo.Gender == 0 ? 'Male' : 'Female' }}</td>
            </tr>
            <tr>
              <td width="150">Year of Birth</td>
              <td>{{ new Date(personInfo.YearOfBirth).getFullYear() }}</td>
            </tr>
          </table>
        </div>
      </div>
      <div class="pdf__item--right w-200">
        <img
          ref="userImage"
          class="img-responsive"
          :src="handleImgSrc(personInfo.Avatar)"
          alt=""
        />
      </div>
    </section>
    <section class="pdf__item">
      <div class="pdf__item--header text-uppercase">professional overview</div>
      <div class="pdf__item--des">
        {{ personInfo.Description }}
      </div>
    </section>
    <section v-if="listSkill.length > 0" class="pdf__item">
      <div class="pdf__item--header text-uppercase">skills</div>
      <div class="table">
        <table>
          <tr v-for="(item, index) in listSkill" :key="index">
            <td width="200" class="text-bold">{{ item.Name }}</td>
            <td>{{ item.Technologies.map((v) => v.Name).join(', ') }}</td>
          </tr>
        </table>
      </div>
    </section>
    <section v-if="listWorkHistory.length > 0" class="pdf__item">
      <div class="pdf__item--header text-uppercase">wordking history</div>
      <div class="table">
        <table>
          <tr class="text-center text-uppercase">
            <th width="50" class="text-center">No</th>
            <th class="text-center">Preriod</th>
            <th class="text-center">company</th>
            <th class="text-center">job title</th>
          </tr>
          <tr v-for="(item, index) in listWorkHistory" :key="index">
            <td class="text-center">{{ index + 1 }}</td>
            <td class="text-center">
              {{ item.StartDate }} - {{ item.EndDate }}
            </td>
            <td class="text-center">{{ item.CompanyName }}</td>
            <td class="text-center">{{ item.Position }}</td>
          </tr>
        </table>
      </div>
    </section>
    <section v-if="listEducation.length > 0" class="pdf__item">
      <div class="pdf__item--header text-uppercase">education</div>
      <div class="table">
        <table>
          <tr v-for="(item, index) in listEducation" :key="index">
            <td class="line-height-25">
              <p class="mt-3 text-bold">
                {{ item.StartDate }} - {{ item.EndDate }} |
                <span class="text-bold"> {{ item.CollegeName }}</span>
              </p>
              <p><span class="text-bold">Major:</span> {{ item.Major }}</p>
            </td>
          </tr>
        </table>
      </div>
    </section>
    <section v-if="listCertificate.length > 0" class="pdf__item">
      <div class="pdf__item--header text-uppercase">certificate</div>
      <div class="table">
        <table>
          <tr v-for="(item, index) in listCertificate" :key="index">
            <td>
              <p class="pt-3">
                {{ item.StartDate }} - {{ item.EndDate }} |
                <span class="text-bold">{{ item.Provider }}</span>
              </p>
            </td>
          </tr>
        </table>
      </div>
    </section>
    <section v-if="listProjects.length > 0" class="pdf__item">
      <div class="pdf__item--header text-uppercase">Project</div>
      <div class="table">
        <table>
          <tr class="text-center text-uppercase">
            <th width="50" class="text-center">NO</th>
            <th width="250" class="text-center">period</th>
            <th width="150" class="text-center">position</th>
            <th class="text-center">description</th>
          </tr>

          <tr v-for="(item, index) in listProjects" :key="index">
            <td class="text-center">{{ index + 1 }}</td>
            <td class="text-center">
              {{ item.Name }}({{ item.StartDate | formatDate }} -
              {{ item.EndDate | formatDate }})
            </td>
            <td class="text-center">{{ item.Position }}</td>
            <td class="unset-padding">
              <div class="border-bottom padding--custom">
                <span class="text-bold">Name :</span>
                <span>{{ item.Name }}</span>
              </div>
              <div class="border-bottom padding--custom">
                <span class="text-bold">Description :</span>
                <span>{{ item.Description }}</span>
              </div>
              <div class="border-bottom padding--custom">
                <span class="text-bold">Responsibilities :</span>
                <span>{{ item.Responsibilities }}</span>
              </div>
              <div class="border-bottom padding--custom">
                <span class="text-bold">Team size :</span>
                <span>{{ item.TeamSize }}</span>
              </div>
              <div class="border-bottom padding--custom">
                <span class="text-bold">Technologies used :</span>
                <span>{{ item.listTechnologies }}</span>
              </div>
            </td>
          </tr>
        </table>
      </div>
    </section>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import moment from 'moment'
import { handleImgSrc } from '@/utils'
export default {
  name: 'Preview',
  filters: {
    formatDate(date) {
      return moment(date).format('MMM YYYY')
    },
  },
  data() {
    return {
      handleImgSrc,
    }
  },
  computed: {
    ...mapGetters({
      listProjects: 'resume/GET_LIST_PROJECT',
      listSkill: 'resume/GET_LIST_SKILL',
      listWorkHistory: 'resume/GET_LIST_WORK_HISTORY',
      listEducation: 'resume/GET_LIST_EDUCATION',
      listCertificate: 'resume/GET_LIST_CERTIFICATE',
      personInfo: 'resume/GET_PERSON_INFO',
    }),
  },
  beforeDestroy() {
    this.$store.dispatch('resume/resetResume') // Reset store
  },
}
</script>
<style scoped lang="scss">
@media screen and (max-width: 600px) {
  .container__resume {
    font-size: 12px !important;
    .header__content {
      margin-right: unset !important;
    }
    .header__logo {
      img {
        height: 30px;
      }
    }
    .pdf__item--right {
      img {
        width: 100% !important;
      }
    }
    .w-200 {
      height: 100px;
    }
    .pdf__item--header {
      height: 30px;
      line-height: 30px;
    }
    table tr td,
    th {
      height: 40px;
      padding-left: 10px;
      border: 1px dotted gray;
    }
    .padding--custom {
      padding: 5px;
    }
  }
}

.w-10 {
  width: 10%;
}
.w-20 {
  width: 20%;
}
.w-auto {
  width: 100%;
}
.w-200 {
  width: 150px;
  height: 150px;
}

.img-responsive {
  height: 107%;
  width: 150px;
}
.w-40 {
  width: 40%;
}
.w-60 {
  width: 60%;
}
.d-flex {
  display: flex;
}
.container__resume {
  margin: 0 auto;
  max-width: 1000px;
}
table {
  width: 100%;
  border-collapse: collapse;
}
.header__content {
  padding: 10px 0;
}
.header__content--des {
  line-height: 20px;
}
.line-height-25 {
  line-height: 25px !important;
}
.unset-padding {
  padding: unset !important;
}
.border-bottom {
  border-bottom: 1px dotted gray;
}
table tr td,
th {
  height: 40px;
  padding-left: 30px;
  border: 1px dotted gray;
}
.list__group--item {
  height: 40px;
  line-height: 40px;
  border: 1px dotted gray;
  padding-left: 20px;
}
.pdf__item--header {
  background: #bdd6ee;
  height: 80px;
  line-height: 80px;
  padding-left: 30px;
  font-weight: bold;
  width: 100%;
}
.text-uppercase {
  text-transform: uppercase;
}
.text-bold {
  color: #000000;
  font-weight: bold;
}
.text-center {
  padding-left: unset !important;
  text-align: center !important;
}
.pdf__item--des {
  padding: 16px 22px 16px 35px;
  line-height: 18px;
}
.padding--custom {
  padding: 10px 0 10px 20px;
}
.main {
  border: 1px solid black;
  font-size: 14px;
  padding: 0;
}
</style>
