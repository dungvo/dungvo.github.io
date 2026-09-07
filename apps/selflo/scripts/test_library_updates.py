import importlib.util
import json
from pathlib import Path
import tempfile
import unittest

spec = importlib.util.spec_from_file_location('updates', Path(__file__).with_name('build-library-updates.py'))
module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)

class UpdateIndexTests(unittest.TestCase):
    def test_only_changed_quote_gets_new_date_and_removed_quote_is_absent(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            (root/'themes').mkdir(); (root/'audit').mkdir()
            def write(path, obj): (root/path).write_text(json.dumps(obj))
            write('themes/t.r1.json', {'quotes':[{'id':'a','text':'same','revision':1},{'id':'b','text':'old'},{'id':'gone','text':'removed'}]})
            write('themes/t.r2.json', {'quotes':[{'id':'a','text':'same','revision':2},{'id':'b','text':'new'}]})
            write('manifest.json', {'library_revision':2,'generated_at':'2026-09-08T00:00:00Z','files':[{'id':'t','kind':'quote_pack','path':'themes/t.r2.json','revision':2}]})
            for n,date in [(1,'2026-09-01T00:00:00Z'),(2,'2026-09-08T00:00:00Z')]:
                write(f'audit/r{n}.json', {'library_revision':n,'generated_at':date,'changed_file_ids':['t']})
            module.build(root)
            result=json.loads((root/'updates.json').read_text())['entities']
            self.assertEqual(result['a']['library_revision'],1)
            self.assertEqual(result['b']['library_revision'],2)
            self.assertNotIn('gone',result)
            (root/'audit/r1.json').unlink()
            module.build(root)
            self.assertIsNone(json.loads((root/'updates.json').read_text())['entities']['a']['updated_at'])

if __name__=='__main__': unittest.main()
