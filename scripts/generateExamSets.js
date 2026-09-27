// Script to generate a wide variety of exam sets for TypingOS
// Run with: node scripts/generateExamSets.js > output.txt

const categories = {
    'ssc-chsl': {
        name: 'SSC CHSL',
        topics: [
            { en: "Economic development and its impact on poverty reduction in developing nations.", hi: "विकासशील देशों में गरीबी कम करने पर आर्थिक विकास और उसका प्रभाव।" },
            { en: "The importance of renewable energy sources in combating climate change.", hi: "जलवायु परिवर्तन से निपटने में नवीकरणीय ऊर्जा स्रोतों का महत्व।" },
            { en: "Digital transformation of government services for better citizen engagement.", hi: "बेहतर नागरिक जुड़ाव के लिए सरकारी सेवाओं का डिजिटल रूपांतरण।" },
            { en: "Role of education in empowering women and achieving social equality.", hi: "महिलाओं को सशक्त बनाने और सामाजिक समानता प्राप्त करने में शिक्षा की भूमिका।" },
            { en: "Challenges of urbanization and sustainable city planning in the 21st century.", hi: "21वीं सदी में शहरीकरण और टिकाऊ शहर नियोजन की चुनौतियां।" },
            { en: "Impact of social media on modern communication and public opinion.", hi: "आधुनिक संचार और जनमत पर सोशल मीडिया का प्रभाव।" },
            { en: "Healthcare infrastructure and its critical role in pandemic preparedness.", hi: "स्वास्थ्य देखभाल बुनियादी ढांचा और महामारी की तैयारी में इसकी महत्वपूर्ण भूमिका।" },
            { en: "The evolution of the Indian constitution and its democratic values.", hi: "भारतीय संविधान का विकास और उसके लोकतांत्रिक मूल्य।" },
            { en: "Space exploration and its contribution to scientific advancements.", hi: "अंतरिक्ष अन्वेषण और वैज्ञानिक प्रगति में इसका योगदान।" },
            { en: "Sustainable agriculture practices to ensure food security for all.", hi: "सभी के लिए खाद्य सुरक्षा सुनिश्चित करने के लिए टिकाऊ कृषि पद्धतियां।" }
        ]
    },
    'ssc-cgl': {
        name: 'SSC CGL',
        topics: [
            { en: "Fiscal policy and its role in managing economic stability and growth.", hi: "आर्थिक स्थिरता और विकास के प्रबंधन में राजकोषीय नीति और इसकी भूमिका।" },
            { en: "The complexity of international trade relations and global supply chains.", hi: "अंतर्राष्ट्रीय व्यापार संबंधों और वैश्विक आपूर्ति श्रृंखलाओं की जटिलता।" },
            { en: "Administrative reforms in civil services for efficient governance.", hi: "कुशल शासन के लिए नागरिक सेवाओं में प्रशासनिक सुधार।" },
            { en: "Legal frameworks for environmental protection and biodiversity conservation.", hi: "पर्यावरण संरक्षण और जैव विविधता संरक्षण के लिए कानूनी रूपरेखा।" },
            { en: "The impact of globalization on local cultures and national identities.", hi: "स्थानीय संस्कृतियों और राष्ट्रीय पहचान पर वैश्वीकरण का प्रभाव।" },
            { en: "Tax administration and the implementation of Goods and Services Tax.", hi: "कर प्रशासन और वस्तु एवं सेवा कर का कार्यान्वयन।" },
            { en: "National security challenges in the era of cyber warfare and digital threats.", hi: "साइबर युद्ध और डिजिटल खतरों के युग में राष्ट्रीय सुरक्षा चुनौतियां।" },
            { en: "The role of the judiciary in upholding the rule of law and human rights.", hi: "कानून के शासन और मानवाधिकारों को बनाए रखने में न्यायपालिका की भूमिका।" },
            { en: "Infrastructure development as a catalyst for industrial and economic expansion.", hi: "औद्योगिक और आर्थिक विस्तार के उत्प्रेरक के रूप में बुनियादी ढांचे का विकास।" },
            { en: "Corporate governance and the importance of ethical business practices.", hi: "कॉर्पोरेट प्रशासन और नैतिक व्यावसायिक प्रथाओं का महत्व।" }
        ]
    },
    'rrb-ntpc': {
        name: 'RRB NTPC',
        topics: [
            { en: "Railway modernization and the introduction of high-speed passenger trains.", hi: "रेलवे आधुनिकीकरण और उच्च गति वाली यात्री ट्रेनों की शुरुआत।" },
            { en: "Safety protocols and advanced signaling systems in rail transport.", hi: "रेल परिवहन में सुरक्षा प्रोटोकॉल और उन्नत सिग्नलिंग सिस्टम।" },
            { en: "The history and development of the Indian railway network since 1853.", hi: "1853 से भारतीय रेलवे नेटवर्क का इतिहास और विकास।" },
            { en: "Technological advancements in track maintenance and rolling stock.", hi: "ट्रैक रखरखाव और रोलिंग स्टॉक में तकनीकी प्रगति।" },
            { en: "Railway logistics and its importance in national freight movement.", hi: "राष्ट्रीय माल ढुलाई में रेलवे रसद और इसका महत्व।" },
            { en: "Passenger amenities and the digitisation of railway ticketing services.", hi: "यात्री सुविधाएं और रेलवे टिकटिंग सेवाओं का डिजिटलीकरण।" },
            { en: "The role of railways in connecting remote regions and promoting tourism.", hi: "दूरदराज के क्षेत्रों को जोड़ने और पर्यटन को बढ़ावा देने में रेलवे की भूमिका।" },
            { en: "Dedicated freight corridors and their impact on industrial logistics.", hi: "समेकित माल ढुलाई गलियारे और औद्योगिक रसद पर उनका प्रभाव।" },
            { en: "Sustainable practices in railway operations and energy efficiency.", hi: "रेलवे संचालन और ऊर्जा दक्षता में टिकाऊ प्रथाएं।" },
            { en: "Public-private partnerships in the expansion of railway infrastructure.", hi: "रेलवे बुनियादी ढांचे के विस्तार में सार्वजनिक-निजी भागीदारी।" }
        ]
    },
    'sbi-po': {
        name: 'SBI PO',
        topics: [
            { en: "Monetary policy and the role of the Reserve Bank of India in inflation control.", hi: "मौद्रिक नीति और मुद्रास्फीति नियंत्रण में भारतीय रिजर्व बैंक की भूमिका।" },
            { en: "Digital banking innovations and the rise of mobile payment systems in India.", hi: "डिजिटल बैंकिंग नवाचार और भारत में मोबाइल भुगतान प्रणालियों का उदय।" },
            { en: "Financial inclusion and the importance of banking services for the unbanked.", hi: "वित्तीय समावेशन और बैंकिंग रहित लोगों के लिए बैंकिंग सेवाओं का महत्व।" },
            { en: "The impact of non-performing assets on the stability of the banking sector.", hi: "बैंकिंग क्षेत्र की स्थिरता पर गैर-निष्पादित परिसंपत्तियों का प्रभाव।" },
            { en: "Banking regulations and the implementation of Basel III norms in India.", hi: "बैंकिंग विनियमन और भारत में बेसल III मानदंडों का कार्यान्वयन।" },
            { en: "Risk management strategies in commercial banking and credit appraisal.", hi: "वाणिज्यिक बैंकिंग और क्रेडिट मूल्यांकन में जोखिम प्रबंधन रणनीतियां।" },
            { en: "Customer service excellence and digital transformation in retail banking.", hi: "रिटेल बैंकिंग में ग्राहक सेवा उत्कृष्टता और डिजिटल परिवर्तन।" },
            { en: "The role of public sector banks in supporting national economic priorities.", hi: "राष्ट्रीय आर्थिक प्राथमिकताओं का समर्थन करने में सार्वजनिक क्षेत्र के बैंकों की भूमिका।" },
            { en: "Microfinance and its contribution to rural entrepreneurship and development.", hi: "सूक्ष्म वित्त और ग्रामीण उद्यमिता और विकास में इसका योगदान।" },
            { en: "Cybersecurity in banking: Protecting financial data from digital fraud.", hi: "बैंकिंग में साइबर सुरक्षा: डिजिटल धोखाधड़ी से वित्तीय डेटा की रक्षा करना।" }
        ]
    },
    'judiciary': {
        name: 'Judiciary',
        topics: [
            { en: "The doctrine of the basic structure of the Indian constitution.", hi: "भारतीय संविधान की मूल संरचना का सिद्धांत।" },
            { en: "Fundamental rights and their protection through judicial review.", hi: "मौलिक अधिकार और न्यायिक समीक्षा के माध्यम से उनका संरक्षण।" },
            { en: "Principles of natural justice and their application in administrative law.", hi: "प्राकृतिक न्याय के सिद्धांत और प्रशासनिक कानून में उनका अनुप्रयोग।" },
            { en: "The role of the Supreme Court in interpreting the law and delivering justice.", hi: "कानून की व्याख्या करने और न्याय प्रदान करने में सुप्रीम कोर्ट की भूमिका।" },
            { en: "Legal procedures in civil and criminal cases under the Indian legal system.", hi: "भारतीय कानूनी प्रणाली के तहत दीवानी और आपराधिक मामलों में कानूनी प्रक्रियाएं।" },
            { en: "The importance of alternative dispute resolution mechanisms like arbitration.", hi: "मध्यस्थता जैसे वैकल्पिक विवाद समाधान तंत्र का महत्व।" },
            { en: "Protection of human rights through public interest litigation in India.", hi: "भारत में जनहित याचिका के माध्यम से मानवाधिकारों का संरक्षण।" },
            { en: "Constitutional provisions regarding the independence of the judiciary.", hi: "न्यायपालिका की स्वतंत्रता के संबंध में संवैधानिक प्रावधान।" },
            { en: "The evolution of environmental jurisprudence and the polluter pays principle.", hi: "पर्यावरण न्यायशास्त्र का विकास और 'प्रदूषक भुगतान' सिद्धांत।" },
            { en: "Legal ethics and the responsibility of lawyers towards the court and society.", hi: "कानूनी नैतिकता और अदालत तथा समाज के प्रति वकीलों की जिम्मेदारी।" }
        ]
    }
};

const difficulties = ['easy', 'medium', 'hard'];
const results = [];

let idCount = 200;

Object.entries(categories).forEach(([examId, data]) => {
    data.topics.forEach((topicPair, index) => {
        const difficulty = difficulties[index % 3];
        // Add English version
        results.push({
            id: `${examId}-gen-en-${idCount++}`,
            examId: examId,
            title: `${data.name} Set ${index + 1} (EN-${difficulty.toUpperCase()})`,
            language: "english",
            difficulty: difficulty,
            content: topicPair.en
        });
        // Add Hindi version
        results.push({
            id: `${examId}-gen-hi-${idCount++}`,
            examId: examId,
            title: `${data.name} सेट ${index + 1} (HI-${difficulty.toUpperCase()})`,
            language: "hindi",
            difficulty: difficulty,
            content: topicPair.hi
        });
    });
});

import fs from 'fs';

// Output the array as TypeScript code to a file
let output = 'export const generatedExamSets: ExamSet[] = [\n';
results.forEach(set => {
    output += `    {\n`;
    output += `        id: "${set.id}",\n`;
    output += `        examId: "${set.examId}",\n`;
    output += `        title: "${set.title}",\n`;
    output += `        language: "${set.language}",\n`;
    output += `        difficulty: "${set.difficulty}",\n`;
    output += `        content: "${set.content.replace(/"/g, '\\"')}"\n`;
    output += `    },\n`;
});
output += '];\n';

fs.writeFileSync('generated_exam_sets.ts', output, 'utf8');
console.log('File generated_exam_sets.ts created successfully.');
