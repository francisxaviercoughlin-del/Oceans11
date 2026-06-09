
import React, { useMemo, useState } from 'react';
import { ScrollView, View, Text, TextInput, TouchableOpacity } from 'react-native';
import ParStepper from '../components/ParStepper';

export default function CreateCourseScreen() {
  const [name,setName] = useState('');
  const [saveMessage,setSaveMessage] = useState('');

  const [holes,setHoles] = useState(
    Array.from({length:18},(_,i)=>({
      hole:i+1,
      par:4,
      strokeIndex:''
    }))
  );

  const updatePar=(idx:number,val:number)=>{
    const h=[...holes];
    h[idx].par=val;
    setHoles(h);
  };

  const updateSI=(idx:number,val:string)=>{
    const h=[...holes];
    h[idx].strokeIndex=val;
    setHoles(h);
  };

  const outPar = holes.slice(0,9).reduce((s,h)=>s+h.par,0);
  const inPar = holes.slice(9,18).reduce((s,h)=>s+h.par,0);
  const totalPar = holes.reduce((s,h)=>s+h.par,0);

  const valid = useMemo(()=>{
    const sis=holes.map(h=>h.strokeIndex);
    if(!name.trim()) return false;
    if(sis.some(s=>!s)) return false;

    const nums=sis.map(Number);

    if(nums.some(n=>n<1 || n>18)) return false;

    return new Set(nums).size===18;
  },[name,holes]);

  const saveCourse=()=>{
    console.log('COURSE SAVED', {name,holes});

    setSaveMessage(`✓ ${name} saved successfully`);

    setTimeout(()=>{
      setSaveMessage('');
    },5000);
  };

  const renderRange=(start:number,end:number)=>
    holes.slice(start,end).map((h,idx)=>(
      <View
        key={h.hole}
        style={{
          flexDirection:'row',
          justifyContent:'space-between',
          marginBottom:10
        }}
      >
        <Text>Hole {h.hole}</Text>

        <ParStepper
          value={h.par}
          onChange={(v:number)=>updatePar(start+idx,v)}
        />

        <TextInput
          value={h.strokeIndex}
          onChangeText={(t)=>updateSI(start+idx,t)}
          keyboardType="numeric"
          placeholder="SI"
          style={{
            borderWidth:1,
            width:50,
            padding:4
          }}
        />
      </View>
    ));

  return (
    <ScrollView contentContainerStyle={{padding:20}}>
      <Text style={{fontSize:28,fontWeight:'700'}}>
        Create Course
      </Text>

      {saveMessage ? (
        <View
          style={{
            backgroundColor:'#DFF0D8',
            padding:12,
            marginTop:10,
            borderRadius:8
          }}
        >
          <Text>{saveMessage}</Text>
        </View>
      ) : null}

      <TextInput
        placeholder="Course Name"
        value={name}
        onChangeText={setName}
        style={{
          borderWidth:1,
          padding:10,
          marginVertical:20
        }}
      />

      <Text style={{fontSize:22,fontWeight:'700'}}>Front 9</Text>
      {renderRange(0,9)}

      <Text style={{fontSize:18,fontWeight:'700'}}>
        OUT PAR: {outPar}
      </Text>

      <Text style={{fontSize:22,fontWeight:'700',marginTop:20}}>
        Back 9
      </Text>

      {renderRange(9,18)}

      <Text style={{fontSize:18,fontWeight:'700'}}>
        IN PAR: {inPar}
      </Text>

      <Text style={{fontSize:22,fontWeight:'700'}}>
        TOTAL PAR: {totalPar}
      </Text>

      <TouchableOpacity
        disabled={!valid}
        onPress={saveCourse}
        style={{
          backgroundColor: valid ? '#8B3A3A' : '#999',
          padding:16,
          marginTop:20
        }}
      >
        <Text
          style={{
            color:'white',
            textAlign:'center'
          }}
        >
          SAVE COURSE
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
