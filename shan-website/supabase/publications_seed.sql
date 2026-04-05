-- =========================================================
-- Publications seed — Shan Jiang academic website
-- Run this in the Supabase SQL Editor (Project → SQL Editor).
-- Safe to re-run: skips on duplicate DOI via ON CONFLICT.
-- =========================================================

-- Add a unique constraint on doi so we can use ON CONFLICT (run once only).
-- If it already exists this statement is harmless.
ALTER TABLE public.publications
  ADD CONSTRAINT publications_doi_unique UNIQUE (doi);

INSERT INTO public.publications
  (title, authors, journal, year, doi, url, tags, featured, pub_type, status, sort_order)
VALUES

-- 2025 ─────────────────────────────────────────────────────────────────────

(
  'Productivity-adjusted life year loss among the late middle-aged adults in China',
  'Yawen Jiang, Bingxin Hu, Huiqiao Gu, Wenjie Hu, Shan Jiang, Yuanyuan Gu, Lei Si',
  'Communications Medicine',
  2025,
  '10.1038/s43856-025-01294-8',
  'https://www.nature.com/articles/s43856-025-01294-8',
  ARRAY['productivity','PALY','China'],
  false, 'journal', 'in_press', 0
),

(
  'Evaluating Cost Effectiveness And Distributional Impact Of Breast Cancer Screening: A Distributional Cost-Effectiveness Analysis Incorporating Patient Preference',
  'Shan Jiang, Bonny Parkinson, Yuanyuan Gu',
  'International Journal of Technology Assessment in Health Care',
  2025,
  '10.1017/S026646232510086X',
  'https://resolve.cambridge.org/core/journals/international-journal-of-technology-assessment-in-health-care/article/op28-evaluating-cost-effectiveness-and-distributional-impact-of-breast-cancer-screening-a-distributional-costeffectiveness-analysis-incorporating-patient-preference/0B0E2AE40F8AC3BAA6B986ED410DB05D',
  ARRAY['DCEA','breast cancer','screening','patient preference'],
  false, 'journal', 'published', 1
),

(
  'Shall We Pay More For Rare Disease Drugs? Assessing Decision-Makers'' Preferences Using A Sequential Discrete Choice Experiment Approach',
  'Yuanyuan Gu, Shan Jiang, Shunping Li, Haiyin Wang',
  'International Journal of Technology Assessment in Health Care',
  2025,
  '10.1017/S0266462325100779',
  'https://resolve.cambridge.org/core/services/aop-cambridge-core/content/view/B337A8FF2B8835EC7E7EDD823F8CAD8F/S0266462325100779a.pdf',
  ARRAY['rare disease','DCE','HTA'],
  false, 'journal', 'published', 2
),

(
  'Strengthening Methods and International Evidence on Health Inequality Aversion',
  'Marie-Anne Boujaoude, Nancy Devlin, Tim Doran, Jeremiah Hurley, Richard Cookson, Shehzad Ali, Yukiko Asada, Mathias Barra, Xiaoning He, Sindre Horn, Shan Jiang, et al.',
  'Value in Health',
  2025,
  '10.1016/j.jval.2025.11.006',
  'https://www.sciencedirect.com/science/article/pii/S109830152505692X',
  ARRAY['health inequality','equity','DCEA','methods'],
  false, 'journal', 'published', 4
),

(
  'How Policymakers Value End-of-Life Treatments for Rare and Common Diseases in China: Evidence from a Contingent Valuation Study',
  'Han Cheng, Shan Jiang, Taoran Liu, Boyang Li, Shanquan Chen, Ao Li, Hao Chen, Haiyin Wang, Yuanyuan Gu',
  'Global Health Research and Policy',
  2025,
  '10.1186/s41256-025-00434-w',
  'https://link.springer.com/article/10.1186/s41256-025-00434-w',
  ARRAY['contingent valuation','rare disease','end-of-life','China'],
  false, 'journal', 'published', 5
),

(
  'Genomic sequencing technologies for rare disease in mainstream medicine: the current state of implementation',
  'Michael Mackley, Pankaj Agrawal, Sara Ali, Alison Archibald, Belinda Dawson-McClaren, Holly Ellard, Lucinda Freeman, Yuanyuan Gu, Kushani Jayasinghe, Shan Jiang, et al.',
  'European Journal of Human Genetics',
  2025,
  '10.1038/s41431-025-01925-7',
  'https://www.nature.com/articles/s41431-025-01925-7',
  ARRAY['genomics','rare disease','implementation'],
  false, 'journal', 'in_press', 6
),

(
  'Aggregate Distributional Cost-Effectiveness Analysis: A Novel Tool for Health Economic Evaluation to Inform Resource Allocation',
  'Shan Jiang, Boyang Li, Bonny Parkinson, Shunping Li, Yuanyuan Gu',
  'Global Health Research and Policy',
  2025,
  '10.1186/s41256-025-00415-z',
  'https://link.springer.com/article/10.1186/s41256-025-00415-z',
  ARRAY['DCEA','CEA','resource allocation','health equity'],
  true, 'journal', 'published', 7
),

(
  'Cost-effectiveness of toripalimab plus chemotherapy versus chemotherapy as first-line treatment for advanced non-small cell lung cancer in China: a societal perspective',
  'Dai Lian, Yi Yang, Yuling Gan, Dunming Xiao, Yuliang Xiang, Shan Jiang, Yuanyuan Gu, Yingyao Chen',
  'Expert Review of Pharmacoeconomics & Outcomes Research',
  2025,
  '10.1080/14737167.2025.2451748',
  'https://doi.org/10.1080/14737167.2025.2451748',
  ARRAY['CEA','lung cancer','immunotherapy','China'],
  false, 'journal', 'published', 8
),

(
  'Physicians'' risk and time preferences and their willingness to detect and disclose genomic secondary findings: A multiple price list experiment',
  'Shan Jiang, Haiyin Wang, Zhuo Chen, Xiao Zang, Yawen Jiang, Zhongliang Zhou, Yuanyuan Gu',
  'Pharmacoeconomics and Policy',
  2025,
  '10.1016/j.pharp.2025.02.001',
  'https://doi.org/10.1016/j.pharp.2025.02.001',
  ARRAY['genomics','physician preferences','secondary findings','DCE'],
  false, 'journal', 'published', 9
),

-- 2024 ─────────────────────────────────────────────────────────────────────

(
  'Secondary Risk-Reducing Strategies for Contralateral Breast Cancer in BRCA1/2 Variant Carriers: A Systematic Review and Meta-analysis',
  'Jing Yu, Shan Jiang, Taoran Liu, Yangyang Gao, Xinyang Ma, Ginenus Fekadu, Yunqiu Xia, Bonny Parkinson, Wai-kit Ming, Yuanyuan Gu',
  'Advances in Therapy',
  2024,
  '10.1007/s12325-024-02808-x',
  'https://doi.org/10.1007/s12325-024-02808-x',
  ARRAY['BRCA','breast cancer','systematic review','meta-analysis'],
  false, 'journal', 'published', 10
),

(
  'Synthesized economic evidence on the cost-effectiveness of screening familial hypercholesterolemia',
  'Mengying Wang, Shan Jiang, Boyang Li, Bonny Parkinson, Jiao Lu, Kai Tan, Yuanyuan Gu, Shunping Li',
  'Global Health Research and Policy',
  2024,
  '10.1186/s41256-024-00382-x',
  'https://link.springer.com/article/10.1186/s41256-024-00382-x',
  ARRAY['CEA','familial hypercholesterolemia','screening','systematic review'],
  false, 'journal', 'published', 11
),

(
  'Economic evaluation of newborn deafness gene screening as a public health intervention in China: a modelling study',
  'Jun-Tao Shu, Yuan-Yuan Gu, Pei-Yao Zhai, Cheng Wen, Min Qian, You-Jia Wu, Xun Zhuang, Qing-Wen Zhu, Lu-Ping Zhang, Shan Jiang, et al.',
  'BMJ Public Health',
  2024,
  '10.1136/bmjph-2023-000838',
  'https://bmjpublichealth.bmj.com/content/2/1/e000838',
  ARRAY['CEA','genomics','newborn screening','China'],
  false, 'journal', 'published', 12
),

(
  'Cost-Effectiveness Analysis of Sintilimab Plus Chemotherapy in Advanced Non-Squamous Non-Small Cell Lung Cancer: A Societal Perspective',
  'Fuming Li, Yingyao Chen, Dunming Xiao, Shan Jiang, Yi Yang',
  'Advances in Therapy',
  2024,
  '10.1007/s12325-024-02985-9',
  'https://link.springer.com/article/10.1007/s12325-024-02985-9',
  ARRAY['CEA','lung cancer','immunotherapy','China'],
  false, 'journal', 'published', 13
),

(
  'Enhancing Neonatal Intensive Care With Rapid Genome Sequencing',
  'Shan Jiang, Bonny Parkinson, Yuanyuan Gu',
  'JAMA Network Open',
  2024,
  '10.1001/jamanetworkopen.2024.0097',
  'https://jamanetwork.com/journals/jamanetworkopen/article-abstract/2815392',
  ARRAY['genomics','neonatal','rapid genome sequencing','commentary'],
  true, 'journal', 'published', 14
),

(
  'Patient Welfare Implications of Indication-specific Value-based Pricing of Multi-indication Drugs',
  'Yawen Jiang, Meng Li, Shan Jiang, Lei Si, Yuanyuan Gu',
  'Value in Health',
  2024,
  '10.1016/j.jval.2023.11.008',
  'https://www.sciencedirect.com/science/article/pii/S1098301523062009',
  ARRAY['drug pricing','value-based pricing','HTA','welfare'],
  true, 'journal', 'published', 15
),

(
  'Authors'' Reply: The Need for a Bleed Type–Specific Annual Bleeding Rate in Hemophilia Studies',
  'Limin Wang, Shimeng Liu, Shan Jiang, Chaofan Li, Liyong Lu, Yunhai Fang, Shunping Li',
  'JMIR Public Health and Surveillance',
  2024,
  '10.2196/54756',
  'https://publichealth.jmir.org/2024/1/e54756',
  ARRAY['hemophilia','correspondence'],
  false, 'journal', 'published', 16
),

-- 2023 ─────────────────────────────────────────────────────────────────────

(
  'Prophylactic Interventions for Hereditary Breast and Ovarian Cancer Risks and Mortality in BRCA1/2 Carriers',
  'Taoran Liu, Jing Yu, Yangyang Gao, Xinyang Ma, Shan Jiang, Yuanyuan Gu, Wai-kit Ming',
  'Cancers',
  2023,
  '10.3390/cancers16010103',
  'https://www.mdpi.com/2072-6694/16/1/103',
  ARRAY['BRCA','hereditary cancer','systematic review','HBOC'],
  false, 'journal', 'published', 17
),

(
  'Blood Donors'' Preferences Toward Incentives for Donation in China',
  'Yu Wang, Peicong Zhai, Shan Jiang, Chaofan Li, Shunping Li',
  'JAMA Network Open',
  2023,
  '10.1001/jamanetworkopen.2023.18320',
  'https://jamanetwork.com/journals/jamanetworkopen/article-abstract/2806012',
  ARRAY['DCE','blood donation','preferences','China'],
  false, 'journal', 'published', 18
),

(
  'Gauging Incentive Values and Expectations (G.I.V.E.) study among Blood Donors for Non-monetary Incentives: Developing a Preference Elicitation Instrument through Qualitative Approaches in Shandong, China',
  'Yu Wang, Peicong Zhai, Yue Zhang, Shan Jiang, Gang Chen, Shunping Li',
  'The Patient–Patient Centered Outcomes Research',
  2023,
  '10.1007/s40271-023-00639-6',
  'https://link.springer.com/article/10.1007/s40271-023-00639-6',
  ARRAY['blood donation','preferences','qualitative','China'],
  false, 'journal', 'published', 19
),

(
  'Breast Cancer Screening Should Embrace Precision Medicine: Evidence by Reviewing Economic Evaluations in China',
  'Jingjing Jiang, Shan Jiang, Antonio Ahumada-Canale, Zhuo Chen, Lei Si, Li Yang, Yuanyuan Gu',
  'Advances in Therapy',
  2023,
  '10.1007/s12325-023-02450-z',
  'https://link.springer.com/article/10.1007/s12325-023-02450-z',
  ARRAY['breast cancer','screening','CEA','precision medicine','China'],
  false, 'journal', 'published', 20
),

(
  'Preferences for public long-term care insurance among middle-aged and elderly residents: A discrete choice experiment in Hubei Province, China',
  'He Ma, Erping Jia, Huimin Ma, Yanzhi Pan, Shan Jiang, Juyang Xiong',
  'Frontiers in Public Health',
  2023,
  '10.3389/fpubh.2023.1050407',
  'https://www.frontiersin.org/articles/10.3389/fpubh.2023.1050407/full',
  ARRAY['DCE','long-term care','elderly','China'],
  false, 'journal', 'published', 22
),

-- 2022 ─────────────────────────────────────────────────────────────────────

(
  'Cost Effectiveness of Denosumab for Secondary Prevention of Osteoporotic Fractures Among Postmenopausal Women in China: An Individual-Level Simulation Analysis',
  'Yawen Jiang, Shan Jiang, Limin Li, Si Shi, Mincai Li, Lei Si',
  'Applied Health Economics and Health Policy',
  2022,
  '10.1007/s40258-022-00784-3',
  'https://link.springer.com/article/10.1007/s40258-022-00784-3',
  ARRAY['CEA','microsimulation','osteoporosis','China'],
  false, 'journal', 'published', 23
),

(
  'Difficulty and help with activities of daily living among older adults living alone during the COVID-19 pandemic: a multi-country population-based study',
  'Shanquan Chen, Linda Jones, Shan Jiang, Rudolf Cardinal',
  'BMC Geriatrics',
  2022,
  '10.1186/s12877-022-02799-w',
  'https://bmcgeriatr.biomedcentral.com/articles/10.1186/s12877-022-02799-w',
  ARRAY['COVID-19','elderly','activities of daily living','population study'],
  false, 'journal', 'published', 24
),

(
  'Patient Preferences in Targeted Pharmacotherapy for Cancers: A Systematic Review of Discrete Choice Experiments',
  'Shan Jiang, Ru Ren, Yuanyuan Gu, Varinder Jeet, Ping Liu, Shunping Li',
  'PharmacoEconomics',
  2022,
  '10.1007/s40273-022-01198-8',
  'https://doi.org/10.1007/s40273-022-01198-8',
  ARRAY['DCE','cancer','targeted therapy','systematic review','patient preferences'],
  true, 'journal', 'published', 25
),

(
  'A scoping review of global guidelines for the disclosure of secondary genomic findings to inform the establishment of guidelines in China',
  'Shan Jiang',
  'China CDC Weekly',
  2022,
  '10.46234/ccdcw2022.146',
  'https://weekly.chinacdc.cn/en/article/doi/10.46234/ccdcw2022.146',
  ARRAY['genomics','secondary findings','guidelines','China'],
  false, 'journal', 'published', 26
),

(
  'Incorporating Productivity Loss in Health Economic Evaluations: A Review of Guidelines and Practices Worldwide and A Research Agenda for China',
  'Shan Jiang, Yitong Wang, Lei Si, Xiao Zang, Yuanyuan Gu, Yawen Jiang, Gordon G. Liu, Jing Wu',
  'BMJ Global Health',
  2022,
  '10.1136/bmjgh-2022-009777',
  'https://gh.bmj.com/content/7/8/e009777.abstract',
  ARRAY['productivity loss','health economics','guidelines','China'],
  false, 'journal', 'published', 27
),

(
  'An Analysis of Life-Year Lost Due to COVID-19 — 34 Countries, December 2019–March 2021',
  'Shan Jiang, Cai Dan, Daqin Chen, Yawen Jiang',
  'China CDC Weekly',
  2022,
  '10.46234/ccdcw2022.109',
  'https://weekly.chinacdc.cn/en/article/doi/10.46234/ccdcw2022.109',
  ARRAY['COVID-19','life-year lost','burden of disease'],
  false, 'journal', 'published', 28
),

-- 2021 ─────────────────────────────────────────────────────────────────────

(
  'Economic Evaluation of Remdesivir for the Treatment of Severe COVID-19 Patients in China under Different Scenarios',
  'Yawen Jiang, Dan Cai, Daqin Chen, Yao Yi, Shan Jiang, Lei Si, Jing Wu',
  'British Journal of Clinical Pharmacology',
  2021,
  '10.1111/bcp.14860',
  'https://doi.org/10.1111/bcp.14860',
  ARRAY['COVID-19','CEA','remdesivir','China'],
  false, 'journal', 'published', 29
),

(
  'Incorporating future unrelated medical costs in cost-effectiveness analysis in China',
  'Shan Jiang, Yitong Wang, Junwen Zhou, Yawen Jiang, Gordon G. Liu, Jing Wu',
  'BMJ Global Health',
  2021,
  '10.1136/bmjgh-2021-006655',
  'https://gh.bmj.com/content/6/10/e006655',
  ARRAY['CEA','future medical costs','methods','China'],
  false, 'journal', 'published', 30
),

(
  'Pharmacoeconomics of Obesity in China: A Scoping Review',
  'Zhuo Chen, Shan Jiang, Youfa Wang, M. Mahmud Khan, Donglan Zhang, Janani Rajbhandari-Thapa, Li Li',
  'Expert Review of Pharmacoeconomics and Outcomes Research',
  2021,
  '10.1080/14737167.2021.1882306',
  'https://www.tandfonline.com/doi/abs/10.1080/14737167.2021.1882306',
  ARRAY['pharmacoeconomics','obesity','scoping review','China'],
  false, 'journal', 'published', 31
),

(
  'Do rural residents in China understand EQ-5D-5L as intended? Evidence from a qualitative study',
  'Fan Yang, Shan Jiang, Xiaoning He, Hongchao Li, Hongyan Wu, Tiantian Zhang, Jing Wu',
  'PharmacoEconomics Open',
  2021,
  '10.1007/s41669-020-00212-z',
  'https://link.springer.com/article/10.1007/s41669-020-00212-z',
  ARRAY['EQ-5D','health utilities','qualitative','China'],
  false, 'journal', 'published', 32
),

(
  'Effectiveness of Remdesivir for the Treatment of Hospitalized COVID-19 Persons: A Network Meta-analysis',
  'Yawen Jiang, Daqin Chen, Dan Cai, Yao Yi, Shan Jiang',
  'Journal of Medical Virology',
  2021,
  '10.1002/jmv.26443',
  'https://onlinelibrary.wiley.com/doi/10.1002/jmv.26443',
  ARRAY['COVID-19','remdesivir','meta-analysis','network meta-analysis'],
  false, 'journal', 'published', 33
),

(
  'Estimation of the Cost-Effective Threshold of a Quality-Adjusted Life Year in China Based on the Value of Statistical Life',
  'Dan Cai, Si Shi, Shan Jiang, Lei Si, Jing Wu, Yawen Jiang',
  'European Journal of Health Economics',
  2021,
  '10.1007/s10198-021-01384-z',
  'https://link.springer.com/article/10.1007/s10198-021-01384-z',
  ARRAY['ICER threshold','QALY','WTP','China'],
  false, 'journal', 'published', 34
),

(
  'A Systematic Review of Measuring the Preference for Targeted Therapy in Cancer Patients by Discrete Choice Experiment',
  'Ping Liu, Shan Jiang, Shunping Li',
  'Chinese Journal of Cancer Prevention and Treatment',
  2021,
  '10.16073/j.cnki.cjcpt.2021.04.13',
  'https://kns.cnki.net/kcms/detail/detail.aspx?doi=10.16073/j.cnki.cjcpt.2021.04.13',
  ARRAY['DCE','cancer','targeted therapy','systematic review','Chinese'],
  false, 'journal', 'published', 35
),

-- 2020 ─────────────────────────────────────────────────────────────────────

(
  'Preferences of Older Patients with Chronic Diseases for Medication Review Services in Shanxi, China: Results from a Discrete Choice Experiment',
  'Jiao Lu, Shan Jiang',
  'Value in Health Regional Issues',
  2020,
  '10.1016/j.vhri.2020.07.460',
  'https://doi.org/10.1016/j.vhri.2020.07.460',
  ARRAY['DCE','elderly','medication review','China'],
  false, 'journal', 'published', 36
),

(
  'Using Instant Messenger to Recruit Research Participants in Medical Decision Making: Does WeChat Provide an Alternative Solution?',
  'Shan Jiang, Jiao Lu',
  'Value in Health',
  2020,
  '10.1016/j.jval.2020.04.1151',
  'https://www.valueinhealthjournal.com/article/S1098-3015(20)31339-5/abstract',
  ARRAY['research methods','recruitment','WeChat','China'],
  false, 'journal', 'published', 37
),

(
  'Best-Worst Scaling in Health Economics in China: Past, Present, and Future',
  'Shan Jiang, Jiao Lu',
  'Value in Health',
  2020,
  '10.1016/j.jval.2020.04.1031',
  'https://www.valueinhealthjournal.com/article/S1098-3015(20)31219-5/abstract',
  ARRAY['best-worst scaling','health economics','methods','China'],
  false, 'journal', 'published', 38
),

(
  'The Application of Synthetic Control Method in Health Policy Assessment',
  'Wenxi Tang, Mengran Zhang, Wenfei Ding, Shan Jiang, Xiao Zang',
  'Chinese Health Economics',
  2020,
  '10.7664/CHE20200404',
  'https://www.cnki.com.cn/Article/CJFDTotal-WEIJ202004006.htm',
  ARRAY['synthetic control','health policy','methods','Chinese'],
  false, 'journal', 'published', 39
),

(
  'Health-Care Practitioners'' Preferences for the Return of Secondary Findings from Next Generation Sequencing: A Discrete-Choice Experiment',
  'Shan Jiang, Aslam Anis, Ian Cromwell, Tima Mohammadi, Kasmintan Shrader, Janet Lucas, Christine Armour, Yvonne Bombard, Dean Regier',
  'Genetics in Medicine',
  2020,
  '10.1038/s41436-020-0927-x',
  'https://doi.org/10.1038/s41436-020-0927-x',
  ARRAY['genomics','secondary findings','DCE','NGS','health professionals'],
  true, 'journal', 'published', 40
),

(
  'Addressing methodological and ethical issues in practicing health economic evaluation in China',
  'Shan Jiang, Zhuo Chen, Jing Wu, Xiao Zang, Yawen Jiang',
  'Journal of Global Health',
  2020,
  '10.7189/jogh.10.020322',
  'https://jogh.org/documents/issue202002/jogh-10-020322.pdf',
  ARRAY['health economics','methods','ethics','China'],
  false, 'journal', 'published', 41
),

(
  'Tertiary Hospitals or Community Clinics? An Enquiry into the Factors Affecting Patients'' Choice for Healthcare Facilities in Urban China',
  'Shan Jiang, Yuanyuan Gu, Fan Yang, Hui Wang, Tao Wu, Henry Cutler, Lufa Zhang',
  'China Economic Review',
  2020,
  '10.1016/j.chieco.2020.101538',
  'https://www.sciencedirect.com/science/article/abs/pii/S1043951X20301358',
  ARRAY['patient choice','healthcare facilities','urban China','economics'],
  false, 'journal', 'published', 42
),

(
  'Burden of cardiovascular diseases associated with fine particulate matter in Beijing, China: an economic modelling study',
  'Yawen Jiang, Shan Jiang, Weiyi Ni',
  'BMJ Global Health',
  2020,
  '10.1136/bmjgh-2020-003160',
  'http://dx.doi.org/10.1136/bmjgh-2020-003160',
  ARRAY['cardiovascular disease','air pollution','burden of disease','China'],
  false, 'journal', 'published', 43
),

(
  'The cost-effectiveness of conducting three versus two reverse transcription-polymerase chain reaction tests for diagnosing and discharging people with COVID-19: evidence from the epidemic in Wuhan, China',
  'Yawen Jiang, Dan Cai, Daqin Chen, Shan Jiang',
  'BMJ Global Health',
  2020,
  '10.1136/bmjgh-2020-002690',
  'https://gh.bmj.com/content/5/7/e002690',
  ARRAY['COVID-19','CEA','diagnostic testing','China'],
  false, 'journal', 'published', 44
),

(
  'Collective Pharmaceutical Procurement in China May Have Unintended Consequences',
  'Shan Jiang, Zhuo Chen, Tao Wu, Hui Wang',
  'Journal of Global Health',
  2020,
  '10.7189/jogh.10.010314',
  'https://pmc.ncbi.nlm.nih.gov/articles/PMC7298735/',
  ARRAY['pharmaceutical procurement','health policy','China'],
  false, 'journal', 'published', 45
),

(
  'Identifying Options of Best Value: Use of Economic Evaluation in Public Health',
  'Zhuo Chen, Lei Zhou, Shan Jiang, Anne Haddix',
  'China CDC Weekly',
  2020,
  '10.46234/ccdcw2020.021',
  'http://weekly.chinacdc.cn/en/article/doi/10.46234/ccdcw2020.021',
  ARRAY['economic evaluation','public health','methods'],
  false, 'journal', 'published', 46
),

-- 2019 ─────────────────────────────────────────────────────────────────────

(
  'Impact of Public Hospital Pricing Reform on Medical Expenditure Structure in Jiangsu, China: A Synthetic Control Analysis',
  'Xiao Zang, Mengran Zhang, Shihao Wei, Wenxi Tang, Shan Jiang',
  'BMC Health Services Research',
  2019,
  '10.1186/s12913-019-4357-x',
  'https://bmchealthservres.biomedcentral.com/articles/10.1186/s12913-019-4357-x',
  ARRAY['health policy','hospital reform','synthetic control','China'],
  false, 'journal', 'published', 47
),

-- 2017 ─────────────────────────────────────────────────────────────────────

(
  'Warm Needling Acupuncture and Medicinal Cake-separated Moxibustion for Hyperlipidemia: Study Protocol for a Randomized Controlled Trial',
  'Mailan Liu, Qian Zhang, Shan Jiang, et al.',
  'Trials',
  2017,
  '10.1186/s13063-017-2029-x',
  'https://trialsjournal.biomedcentral.com/articles/10.1186/s13063-017-2029-x',
  ARRAY['RCT','acupuncture','hyperlipidemia'],
  false, 'journal', 'published', 48
),

(
  'Human papillomavirus and oral squamous cell carcinoma: A review of HPV-positive oral squamous cell carcinoma and possible strategies for future',
  'Shan Jiang, Yong Dong',
  'Current Problems in Cancer',
  2017,
  '10.1016/j.currproblcancer.2017.02.006',
  'https://pubmed.ncbi.nlm.nih.gov/28416242/',
  ARRAY['HPV','oral cancer','review'],
  false, 'journal', 'published', 49
),

(
  'The role of education in colorectal cancer screening participation: Updated evidence from Canadian Community Health Survey (2011-2012)',
  'Shan Jiang, Hector Velasquez-Garcia',
  'Cancer Treatment and Research Communications',
  2017,
  '10.1016/j.ctarc.2016.10.001',
  'https://www.sciencedirect.com/science/article/abs/pii/S2468294216300302',
  ARRAY['colorectal cancer','screening','education','Canada'],
  false, 'journal', 'published', 50
),

-- 2016 ─────────────────────────────────────────────────────────────────────

(
  'Chinese Health System Development From 1949 To 2015: A Systematic Review',
  'Shan Jiang, Yalu Zhang, Jingpei Long, Yong Dong',
  'Value in Health',
  2016,
  '10.1016/j.jval.2016.03.747',
  'https://www.valueinhealthjournal.com/article/S1098-3015(16)00815-9/fulltext',
  ARRAY['Chinese health system','systematic review','health policy'],
  false, 'journal', 'published', 51
),

(
  'Health Policy Review: Regional Reforms in Hospitals, Medical Personal System, and Mode of Payment in China',
  'Yalu Zhang, Shan Jiang, Jingpei Long, Yong Dong',
  'Value in Health',
  2016,
  '10.1016/j.jval.2016.03.1947',
  'https://www.valueinhealthjournal.com/article/S1098-3015(16)30232-7/abstract',
  ARRAY['health policy','hospital reform','China'],
  false, 'journal', 'published', 52
)

ON CONFLICT (doi) DO NOTHING;

-- Handle the two rows with NULL doi separately (no ON CONFLICT on NULL)
INSERT INTO public.publications
  (title, authors, journal, year, doi, url, tags, featured, pub_type, status, sort_order)
SELECT
  'What Do Chinese Patients Value in Orthodontic Treatment? A Discrete Choice Experiment',
  'Lidan Wang, Dandan Yu, Shan Jiang, Yihui Li, Wang Yao, Jiajia Liu, Han Cheng, Jianguang Xu, Wenhua Xu, Yuanyuan Gu',
  'Scientific Reports',
  2025,
  NULL,
  NULL,
  ARRAY['DCE','orthodontics','China'],
  false, 'journal', 'in_press', 3
WHERE NOT EXISTS (
  SELECT 1 FROM public.publications
  WHERE title = 'What Do Chinese Patients Value in Orthodontic Treatment? A Discrete Choice Experiment'
);

INSERT INTO public.publications
  (title, authors, journal, year, doi, url, tags, featured, pub_type, status, sort_order)
SELECT
  'ICER Threshold Adjustment in China Incorporating Equity Considerations: A Case Study of Orphan Drugs',
  'Shan Jiang, Yuanyuan Gu, Shunping Li, Haiyin Wang',
  'China Pharmaceutical Circulation Association',
  2023,
  NULL,
  NULL,
  ARRAY['ICER','equity','orphan drugs','HTA','China'],
  false, 'journal', 'published', 21
WHERE NOT EXISTS (
  SELECT 1 FROM public.publications
  WHERE title = 'ICER Threshold Adjustment in China Incorporating Equity Considerations: A Case Study of Orphan Drugs'
);
