(function () {

    // ── Helper: pull architecture image from a paper in any array ──
    function archFrom(arr, keywords, fallback) {
        var paper = (arr || []).find(function (p) {
            var t = (p.title || '').toLowerCase();
            return keywords.some(function (kw) { return t.indexOf(kw.toLowerCase()) !== -1; });
        });
        return (paper && paper.architecture) ? paper.architecture : fallback;
    }

    // ── Research Highlights ──
    portfolioData.research.highlights = [
        {
            title: "NeuroTab: An XAI-Integrated Neurological Tabular Network for Classifying Primary Headache Disorders",
            shortTitle: "NeuroTab: Headache Classifier",
            status: "In Progress",
            badge: "Current Work",
            contribution: "Proposed NeuroTab for automated headache disorder diagnosis using clinical tabular data, attaining up to 99.31% accuracy. Integrated XAI techniques providing interpretable clinical predictions for real-world decision support.",
            architecture: archFrom(portfolioData.research.journal, ['neurotab', 'headache'], 'https://i.postimg.cc/sD1FGsDj/neurotab.png'),
            skills: ["Deep Learning", "XAI", "Tabular Network", "Python", "Flask"]
        },
        {
            title: "BDRoadRisk: Analysis of Large-Scale GPS Traffic Accident Severity Dataset in a Big Data Environment",
            shortTitle: "BDRoadRisk: Severity Detection",
            status: "In Progress",
            badge: "Current Work",
            contribution: "Deployed 10 million Parquet records to HDFS in Oracle VirtualBox and executed distributed queries through Apache Drill to predict accident severity using ML/DL on big data infrastructure.",
            architecture: archFrom(portfolioData.research.conference, ['BDRoadRisk'], 'https://i.postimg.cc/pXf7FLcG/Fig-7.png'),
            skills: ["Big Data", "HDFS", "Apache Drill", "Python", "ML","DL"]
        },
        {
            title: "CreditTransAct: A Profile-Driven Credit Card Transaction Dataset for Scalable Fraud Detection in Big Data Settings",
            shortTitle: "CreditTransAct: Fraud Detection",
            status: "In Progress",
            badge: "Current Work",
            contribution: "Deployed 15 million Parquet records to HDFS in Oracle VirtualBox and executed distributed queries through Trino & HiveQL to detect credit fraud using ML/DL models.",
            architecture: archFrom(portfolioData.research.conference, ['CreditTransAct'], 'https://i.postimg.cc/CKCLrq71/ccfd.png'),
            skills: ["Big Data", "HDFS", "Trino", "HiveQL", "Python", "ML", "DL"]
        }
    ];

    // ── Conference papers — exact order in data.js ──
    var CONF_META = [
        { date: new Date('2025-06-10').getTime(), dateLabel: 'Jun 2025', citations: 3, status: 'Published'    }, // [1] PCOS
        { date: new Date('2025-06-10').getTime(), dateLabel: 'Jun 2025', citations: 2, status: 'Published'    }, // [2] Parkinson's
        { date: new Date('2025-04-01').getTime(), dateLabel: 'Apr 2025', citations: 5, status: 'Published'    }, // [3] Maternal-Fetal
        { date: new Date('2024-11-04').getTime(), dateLabel: 'Nov 2024', citations: 6, status: 'Published'    }  // [4] Dyslexia
    ];

    (portfolioData.research.conference || []).forEach(function (paper, i) {
        var meta = CONF_META[i];
        if (meta) {
            paper.date      = meta.date;
            paper.dateLabel = meta.dateLabel;
            paper.citations = meta.citations;
            paper.status    = meta.status;
        }
    });

    // ── Journal papers ──
    (portfolioData.research.journal || []).forEach(function (p) {
        if (p.status === 'Under Review') {
            p.citations = 0;
            p.date = 0;
            p.dateLabel = '';
        } else {
        p.citations = 4;
        p.date = new Date('2024-02-04').getTime();
        p.dateLabel = 'Feb 2024';
        p.status = 'Published';
        }
    });

})();