<template>
  <div>
    <md-dialog class="card" style="position:grid;place-items:center" :md-active.sync="pickProvince">
      <md-card-header-text class="center-align">
        <div class="md-subheader center-align">Please pick your province</div>
      </md-card-header-text>
      <md-content class="row">
        <md-list class="md-double-line">
          <md-list-item v-for="province in provinces" :key="province.code" v-on:click="PickProvince(province.name)" class="waves-effect">
            <md-icon class="md-primary">map</md-icon>
            <div class="md-list-item-text">
              <span>{{ province.name }}</span>
            </div>
          </md-list-item>
        </md-list>
      </md-content>
    </md-dialog>
    <div class="row" v-if="currentPage == -1">
      <div class="col s10 offset-s1 m8 offset-m2 row card-panel">
        <div class="col s12">
          <div class="card-image col l8 offset-l2 m6 offset-m3 s12">
            <img class="img-responsive" src="static/img/coPortalLogo.jpg">
          </div>
        </div>
        <div class="col s12">
          <div class="row">
            <div class="col s8 offset-s2 m6 offset-m3 text-center">
              <span class="text-center">Co-portal is a school management system that 63Solutions is currently introducing to schools, the system is currently operating in one school in Rustenburg and the following are some of the key functions that the system does:</span>
            </div>
          </div>
          <div class="row">
            <div v-for="(feature,i) in features" :key="i" class="col s8 offset-s2 m6 offset-m3 text-center card-panel hoverable pointer waves-effect">
              <p>{{ i + 1 }}. {{ feature }}</p>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col s12 center-align">
            <p>We would really appreciate it if you take part in the survey below.</p>
          </div>
          <div v-on:click="GoToNextPage(false)" class="col m4 offset-m4 s12 pointer center-align waves-effect">
            <div class="card-panel hoverable">
              <h5 class="text-xs-center">Take the survey <i class="material-icons right">exit_to_app</i> </h5>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="row" v-if="currentPage == 0">
      <div class="col s10 offset-s1 m8 offset-m2 row card-panel">
        <div class="col s12">
          <h5><strong>Feedback Survey</strong></h5>
          <div class="card-image col l8 offset-l2 m6 offset-m3 s12">
            <img class="img-responsive" src="static/img/coPortalLogo.jpg">
          </div>
          <md-button v-on:click="currentPage = -1" class="md-fab">
            <md-icon>close</md-icon>
          </md-button>
        </div>
        <div class="col s12">
          <div class="row" v-for="(survey,i) in Survey" :key="i">
            <div v-show="survey.Question != 'Province'" class="input-field col s8 offset-s2 m6 offset-m3 text-center">
              <input :id="`survey-${i}`" v-model="survey.Answer" type="text" />
              <label :for="`survey-${i}`" class="text-center">Enter your {{ survey.Question }} <span class="red-text">{{ survey.Optional ? '' : ' *' }}</span></label>
            </div>
            <div v-on:click="pickProvince = true" v-show="survey.Question == 'Province'" class="col s8 waves-effect offset-s2 m6 offset-m3 align-center pointer">
              <div class="md-list-item-text black-text align-center">
                <span>{{ (selectedProvince.length == 0) ? 'Tap to select a province' : 'Tap to change your province' }}</span>
                <label id="survey-22">{{ selectedProvince }}</label>
              </div>
            </div>
          </div>
        </div>
        <div class="col m8 offset-m2 s12">
          <p class="center-align red-text" v-show="txtError.length > 2">{{ txtError }}</p>
        </div>
        <div class="row">
          <div v-on:click="GoToNextPage(false)" class="col m4 offset-m4 s12 pointer center-align waves-effect">
            <div class="card-panel hoverable">
              <h5 class="text-xs-center">Next <i class="material-icons right">exit_to_app</i> </h5>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="row" v-if="currentPage == 1">
      <div class="col s10 offset-s1 m8 offset-m2 row card-panel">
        <div class="col s12">
          <h5><strong>Feedback Survey</strong></h5>
          <div class="card-image col l8 offset-l2 m6 offset-m3 s12">
            <img class="img-responsive" src="static/img/coPortalLogo.jpg">
          </div>
          <md-button v-on:click="currentPage = -1" class="md-fab">
            <md-icon>close</md-icon>
          </md-button>
        </div>
  
        <div class="col s10 offset-s1 z-depth-1 row" v-if="question" v-for="(question,i) in Questionare" :key="i">
          <div class="col s12">
            <h5 class="center-align">{{ question.question }}</h5>
          </div>
          <div class="col m8 offset-m2 s12">
            <form>
              <div v-if="question.type != 'STRING' && question.options != null">
                <h6 class="pointer" v-for="(option,d) in question.options" :key="d">
                  <label>
                                                  <input v-model="surveyAnswers[i].Answer" :value="option" class="with-gap" :name="question._id" :type="(question.type == 'STRING')  ? 'text': 'radio'" />
                                                    <span >{{ option }}</span>
                                                  </label>
                </h6>
              </div>
              <div v-else>
                <h6 class="pointer">
                  <label>
                                                   <input v-model="surveyAnswers[i].Answer"  placeholder="Enter Response" class="with-gap center-align"  :type="(question.type == 'STRING')  ? 'text': 'radio'" />
                                                </label>
                </h6>
              </div>
              <div v-if="question.optional && question.optional.answer == surveyAnswers[i].Answer">
                <h6 class="pointer">
                  <label> 
                                                   <input v-model="surveyAnswers[i].Answer2"   :placeholder="question.optional.question" class="with-gap center-align"  type="text" />
                                                </label>
                </h6>
              </div>
            </form>
          </div>
          <div class="col m8 offset-m2 s12">
            <p class="center-align red-text" v-show="txtError.length > 2">{{ txtError }}</p>
          </div>
        </div>
  
        <div class="row">
          <div v-on:click="GoToNextPage(true)" class="col m4 offset-m4 s12 pointer center-align waves-effect">
            <div class="card-panel hoverable">
              <h5 class="text-xs-center">Submit <i class="material-icons right">done</i> </h5>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import swal from "sweetalert";
const axios = require("axios");

export default {
  name: "Test",
  watch: {
    surveyAnswers(newVal, oldVal) {
      this.$forceUpdate();
    }
  },
  data() {
    return {
      pickProvince: false,
      features: [
        "Serves as a communication tool between a teacher, parent and a learner",
        "Allows a student to write an online assessment and the system marks the assessment and gives results to both students and parents",
        "Allows a teacher to send out previous questions papers or any study material to a student",
        "Allows a teacher to post test results of each subject that a learner is doing and parents will monitor how their children are performing at school",
        "Provides career guidance as we have noticed that a lot of learners do not know which career path to follow after matric"
      ],
      txtError: "",
      Questionare: [],
      surveyAnswers: [
        {
          QuestionId: String,
          Answer: String,
          Answer2: String
        }
      ],
      Survey: [
        {
          Question: "Name",
          Answer: null
        },
        {
          Question: "Surname",
          Answer: null
        },
        {
          Question: "Email",
          Answer: null
        },
        {
          Question: "Province",
          Answer: null
        }
      ],
      currentPage: -1,
      selectedProvince: "",
      provinces: [
        {
          name: "Eastern Cape",
          code: "ZA-EC"
        },
        {
          name: "Free State",
          code: "ZA-FS"
        },
        {
          name: "Gauteng",
          code: "ZA-GT"
        },
        {
          name: "KwaZulu-Natal",
          code: "ZA-NL"
        },
        {
          name: "Limpopo",
          code: "ZA-LP"
        },
        {
          name: "Mpumalanga",
          code: "ZA-MP"
        },
        {
          name: "North West",
          code: "ZA-NW"
        },
        {
          name: "Northern Cape",
          code: "ZA-NC"
        },
        {
          name: "Western Cape",
          code: "ZA-WC"
        }
      ]
    };
  },
  mounted() {
    axios
      .get(
        this.$store.state.settings.baseLink + "/survey/get/all/surveyquestions"
      )
      .then(results => {
        this.Questionare = results.data;
        this.surveyAnswers = [];
        this.Questionare.forEach(question => {
          this.surveyAnswers.push({
            QuestionId: question._id,
            Answer: null
          });
        });
      })

      .catch(err => {
        if (err.response != null && err.response.status == 512) {
          swal(err.response.data, "error");
        } else {
          swal("Unable to load Survey", "Try again later", "error");
        }
      });
  },
  methods: {
    PickProvince(province) {
      this.selectedProvince = province;
      this.pickProvince = false;
    },
    GoToNextPage(final) {
      this.txtError = "";
      if (this.currentPage == -1) {
        this.currentPage = 0;
      } else if (!final) {
        var arr = this.Survey.reverse();
        arr.forEach(survey => {
          if (survey.Question == "Province") {
            survey.Answer = this.selectedProvince;
          }
          if (
            !survey.Optional &&
            (survey.Answer == null || survey.Answer.length < 2)
          ) {
            this.txtError = "Please fill in  your " + survey.Question;
          }
        });
        var arr = this.Survey.reverse();
        if (this.txtError.length > 2) {
          return;
        }
        this.currentPage = 1;
      } else {
        axios
          .post(this.$store.state.settings.baseLink + "/survey/submit", {
            user: this.Survey,
            survey: this.surveyAnswers
          })
          .then(results => {
            swal("Thank you!", "We got your feedback!", "success").then(v => {
              this.$router.push("/");
            });
          })
          .catch(err => {
            if (err.response != null && err.response.status == 512) {
              swal(err.response.data, "error");
            } else {
              swal("Unable to submit your Survey", "Try again later", "error");
            }
          });
      }
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.md-select-menu {
  width: 100%;
}
</style>
