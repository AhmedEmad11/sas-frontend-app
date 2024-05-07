import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { GlobalService } from 'src/app/providers/services/global.service';

import * as faceapi from 'face-api.js'

@Component({
  selector: 'app-stream',
  templateUrl: './stream.component.html',
  styleUrls: ['./stream.component.css']
})
export class StreamComponent implements OnInit {

  constructor(public _global:GlobalService, private router:Router, private route:ActivatedRoute) { }

  video:any
  restart:any
  subjectId:any
  levelId:any
  students:any[] = []
  ids:any[] = []
  loaded:boolean = false
  logged  :any[] = []
  recording: boolean=false
  
  ngOnInit(): void {
    this.route.params.subscribe((params: Params)=>{
      this.subjectId = params.subject
    } )

    this.route.params.subscribe((params: Params)=>{
      this.levelId = params.level
    } )

    this._global.getSubjectAttendance(this.levelId,this.subjectId).subscribe(
      data=>{

        this.students = data
        
        this.students.forEach(el => {

          this.ids.push(el.id.toString())
        })
        
      },
      ()=>{},
      ()=>{}
      
    )

    this.video = document.getElementById('video')
    this.restart = document.getElementById('restart')

    Promise.all([
      faceapi.nets.faceRecognitionNet.loadFromUri('../assets/models'),
      faceapi.nets.faceLandmark68Net.loadFromUri('../assets/models'),
      faceapi.nets.ssdMobilenetv1.loadFromUri('../assets/models')
    ]).then(this.start)

  }

  setupCamera = () => {
    navigator.mediaDevices.getUserMedia({
      video: {width: 600, height:400},
      audio: false
    })
    .then((stream) => {

      this.video.srcObject = stream
    })
  }

  loadLabeledImages = () => {
    const labels = this.ids
    return Promise.all(
      labels.map(async label => {
        
        const descriptions = []
        for (let i = 1; i <= 6; i++) {
          const img = await faceapi.fetchImage(`../assets/labeled_images/${label}/${i}.jpg`)
          const detections = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor()
          if(detections){
            
            descriptions.push(detections.descriptor)
          }
        }
        return new faceapi.LabeledFaceDescriptors(label, descriptions)
      })
    )
  }

recognizeFaces = async () => {
    
    const labeledDescriptors = await this.loadLabeledImages()

    this.loaded = true
    const faceMatcher = new faceapi.FaceMatcher(labeledDescriptors, 0.9)
    let camera = document.getElementById('camera')

    this.video.addEventListener('play', async () => {
        const canvas = faceapi.createCanvasFromMedia(this.video)
        camera?.appendChild(canvas)

        const displaySize = { width: this.video.width, height: this.video.height }
        faceapi.matchDimensions(canvas, displaySize)

        setInterval(async () => {
            const detections = await faceapi.detectAllFaces(this.video).withFaceLandmarks().withFaceDescriptors()

            const resizedDetections = faceapi.resizeResults(detections, displaySize)
            
            const results = resizedDetections.map((d) => {
                return faceMatcher.findBestMatch(d.descriptor)
            })
            results.forEach( (result, i) => {
              let  nameAndDist = result.toString().split(' ')
              
              let dist = parseFloat(nameAndDist[1].slice(1, nameAndDist[1].length-1))
              
              if(dist < 0.4 && !(this.logged.includes((nameAndDist[0]))) ){
                let id = (nameAndDist[0])
              
                this.students.forEach((s) => {
                  if(s.id == id){
                
                    if(s.attendance[0].count<=12){
                      
                      this.logged.push(id)
                      this.markAttendance(nameAndDist[0])
                      s.attendance[0].count +=1
                      
                  }
                }})
              }
            }
          )
        }, 
      50)

        
    }
  )
}

  start = () => {
    this.setupCamera()
    this.recognizeFaces()
  }

  startRec = () =>{
    this.video.pause()
    this.video.load()
    this.recording=true
    this.setupCamera()
  }





  stopRec = () =>{
    navigator.mediaDevices.getUserMedia({video: {width: 600, height:400},audio: false})
    .then((stream) => {
    this.video.srcObject = stream
    let track = stream.getTracks()[0];
          track.stop();     
        }) 
        this.recording=false
      }
  


  markAttendance (studentid:any){
    let data = {
      "subjectId": this.subjectId,
      "studentId": studentid
    }
    this.students.filter((el)=>{
      if(el.id==studentid){
        if(el.attendance[0].count<=12){
    
          this._global.markAttendance(data).subscribe(
            data=>{
        
              this.students.forEach((s) => {
                if(s.id == studentid){
                  if(s.attendance[0]){
      
                    s.attendance[0].count +=1
                    
                }
              }})
            },
            ()=>{},
            ()=>{}
          )
        }
      }
      
    })
  }
  

}